"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { useSupabaseBrowser } from "../hooks/useSupabaseBrowser";
import {
  computeCallerExperience,
  type CallerExperience,
} from "../metrics/caller-experience";
import { useHelplineStore } from "../state/helpline-store";

/**
 * Caller-centered metrics for the selected helpline and window.
 *
 * `caller_number` is fetched because grouping repeat callers requires it, but it arrives
 * SHA-256 hashed — so it is only ever used as an opaque grouping key and never rendered.
 */
export const useCallerExperience = () => {
  const { helplineId, lastNDaysDateint } = useHelplineStore();
  const supabase = useSupabaseBrowser();
  const [data, setData] = useState<CallerExperience | undefined>(undefined);

  const fetchData = useCallback(async () => {
    if (!helplineId) return;

    const { data: calls, error } = await supabase
      .from("cleaned_calls")
      .select("caller_number, call_time, is_missed_call")
      .eq("helpline_id", helplineId)
      .gte("dateint", lastNDaysDateint);
    if (error) throw error;

    setData(computeCallerExperience({ calls: calls ?? [] }));
  }, [helplineId, lastNDaysDateint, supabase]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return useMemo(() => ({ data, isLoading: data === undefined }), [data]);
};
