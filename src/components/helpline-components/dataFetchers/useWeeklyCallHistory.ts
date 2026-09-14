"use client";

import { useCallback, useEffect, useState } from "react";

import { useSupabaseBrowser } from "../hooks/useSupabaseBrowser";
import {
  MS_PER_DAY,
  RELIABILITY_CUTOFF_DATEINT,
  WEEKLY_ACTIVITY_WEEKS,
} from "../metrics/constants";
import type { WeeklyActivityCallRow } from "../metrics/operator-weekly-activity";
import { useHelplineStore } from "../state/helpline-store";

const dateintDaysAgo = (days: number): number => {
  const date = new Date(Date.now() - days * MS_PER_DAY);
  return Number(date.toISOString().split("T")[0]!.replace(/-/g, ""));
};

/**
 * Raw call rows for the trailing {@link WEEKLY_ACTIVITY_WEEKS} weeks, fetched once per
 * helpline and shared across every operator's weekly activity chart — expanding a second
 * or third row re-uses this instead of issuing a new query per operator.
 *
 * Clamped to the reliability cutoff, same as every other opportunity-based calculation:
 * `assigned_operators` was not recorded before it.
 */
export const useWeeklyCallHistory = () => {
  const { helplineId } = useHelplineStore();
  const supabase = useSupabaseBrowser();
  const [data, setData] = useState<WeeklyActivityCallRow[] | undefined>(
    undefined
  );

  const fetchData = useCallback(async () => {
    if (!helplineId) return;

    const windowStart = Math.max(
      dateintDaysAgo(WEEKLY_ACTIVITY_WEEKS * 7),
      RELIABILITY_CUTOFF_DATEINT
    );

    const { data: calls, error } = await supabase
      .from("cleaned_calls")
      .select("dateint, call_time, operator_name, assigned_operators")
      .eq("helpline_id", helplineId)
      .gte("dateint", windowStart);
    if (error) throw error;

    setData(calls ?? []);
  }, [helplineId, supabase]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading: data === undefined };
};
