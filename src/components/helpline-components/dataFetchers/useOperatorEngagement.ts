"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { useSupabaseBrowser } from "../hooks/useSupabaseBrowser";
import { RELIABILITY_CUTOFF_DATEINT } from "../metrics/constants";
import {
  computeOperatorEngagement,
  needsFollowUp,
  sortByTriage,
  type OperatorEngagement,
} from "../metrics/operator-engagement";
import { useHelplineStore } from "../state/helpline-store";

/**
 * Engagement states for the selected helpline, ordered for triage.
 *
 * Excludes operators no longer on the schedule — once someone is off the phone tree there
 * is no follow-up to do, so they are dropped rather than flagged.
 *
 * The window is the reliability cutoff rather than the dashboard's Last-N-Days selector:
 * `assigned_operators` is empty before it, so a longer lookback would count opportunities
 * that were never recorded and make every operator look worse than they are.
 */
export const useOperatorEngagement = () => {
  const { helplineId } = useHelplineStore();
  const supabase = useSupabaseBrowser();
  const [data, setData] = useState<OperatorEngagement[] | undefined>(undefined);

  const fetchData = useCallback(async () => {
    if (!helplineId) return;

    const { data: calls, error: callsError } = await supabase
      .from("cleaned_calls")
      .select("dateint, call_time, operator_name, assigned_operators")
      .eq("helpline_id", helplineId)
      .gte("dateint", RELIABILITY_CUTOFF_DATEINT);
    if (callsError) throw callsError;

    const { data: schedule, error: scheduleError } = await supabase
      .from("operator_schedule")
      .select("operator_name")
      .eq("helpline_id", helplineId);
    if (scheduleError) throw scheduleError;

    setData(
      sortByTriage(
        computeOperatorEngagement({
          calls: calls ?? [],
          schedule: schedule ?? [],
        }).filter((row) => needsFollowUp(row.state))
      )
    );
  }, [helplineId, supabase]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return useMemo(() => ({ data, isLoading: data === undefined }), [data]);
};
