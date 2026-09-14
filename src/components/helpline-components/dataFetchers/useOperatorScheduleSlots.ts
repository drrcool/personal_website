"use client";

import { useCallback, useEffect, useState } from "react";

import { useSupabaseBrowser } from "../hooks/useSupabaseBrowser";
import type { OperatorScheduleRow } from "../metrics/operator-schedule-slots";
import { useHelplineStore } from "../state/helpline-store";

/**
 * Raw `operator_schedule` rows for the current helpline, fetched once and shared across
 * every expanded operator's schedule summary — matching {@link useWeeklyCallHistory}'s
 * fetch-once-and-filter-client-side pattern rather than querying per operator.
 */
export const useOperatorScheduleSlots = () => {
  const { helplineId } = useHelplineStore();
  const supabase = useSupabaseBrowser();
  const [data, setData] = useState<OperatorScheduleRow[] | undefined>(
    undefined
  );

  const fetchData = useCallback(async () => {
    if (!helplineId) return;

    const { data: rows, error } = await supabase
      .from("operator_schedule")
      .select("operator_name, day_of_week, hour_of_day")
      .eq("helpline_id", helplineId);
    if (error) throw error;

    setData(rows ?? []);
  }, [helplineId, supabase]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading: data === undefined };
};
