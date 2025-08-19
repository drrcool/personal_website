"use client";

import { useEffect, useMemo, useState, useCallback } from "react";

import { useSupabaseBrowser } from "../hooks/useSupabaseBrowser";
import { useHelplineStore } from "../state/helpline-store";

interface Point {
  call_cnt: number;
  missed_call_cnt: number;
  connected_call_cnt: number;
  dateint: string;
}

export function useCallTimeSeries() {
  const { helplineId, timeseriesStartDate } = useHelplineStore();
  const supabase = useSupabaseBrowser();
  const [data, setData] = useState<Point[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!helplineId) return;
    setIsLoading(true);
    setError(null);
    try {
      let q1 = supabase
        .from("cleaned_calls")
        .select(
          `
          month, year,
          call_cnt:count(),
          missed_call_cnt:is_missed_call.sum()
        `
        )
        .eq("helpline_id", helplineId)
        .gte("dateint", 20220301);

      if (timeseriesStartDate) q1 = q1.gte("dateint", timeseriesStartDate);
      q1 = q1
        .order("year", { ascending: true })
        .order("month", { ascending: true });
      const { data: recent, error: err1 } = await q1;
      if (err1) throw err1;

      let q2 = supabase
        .from("historical_call_cnts")
        .select("year, month:month_of_year, call_cnt, missed_call_cnt")
        .eq("helpline_id", helplineId)
        .lt("dateint", 20220301);

      if (timeseriesStartDate) q2 = q2.gte("dateint", timeseriesStartDate);
      q2 = q2
        .order("year", { ascending: true })
        .order("month_of_year", { ascending: true });
      const { data: hist, error: err2 } = await q2;
      if (err2) throw err2;

      const joined = [...(hist || []), ...(recent || [])];
      setData(
        joined.map((r) => ({
          call_cnt: r.call_cnt ?? 0,
          missed_call_cnt: r.missed_call_cnt ?? 0,
          connected_call_cnt: (r.call_cnt ?? 0) - (r.missed_call_cnt ?? 0),
          dateint: `${r.year}-${String(r.month).padStart(2, "0")}-01`,
        }))
      );
    } catch (e) {
      setError(e as Error);
    } finally {
      setIsLoading(false);
    }
  }, [supabase, helplineId, timeseriesStartDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return useMemo(
    () => ({ data, isLoading, error, refetch: fetchData }),
    [data, isLoading, error, fetchData]
  );
}
