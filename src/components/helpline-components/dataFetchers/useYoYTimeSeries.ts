"use client";

import {
  arrange,
  asc,
  groupBy,
  pivotWider,
  sum,
  summarize,
  tidy,
} from "@tidyjs/tidy";
import { useEffect, useMemo, useState, useCallback } from "react";

import { useSupabaseBrowser } from "../hooks/useSupabaseBrowser";
import { useHelplineStore } from "../state/helpline-store";

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const useYoYTimeSeries = () => {
  const { helplineId } = useHelplineStore();
  const supabase = useSupabaseBrowser();
  const [data, setData] = useState<Array<Record<string, string | number>>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!helplineId) return;
    setIsLoading(true);
    setError(null);
    try {
      const q1 = supabase
        .from("cleaned_calls")
        .select(
          `
          month, year,
          call_cnt:count()
        `
        )
        .eq("helpline_id", helplineId)
        .gte("dateint", 20220301)
        .order("year", { ascending: true })
        .order("month", { ascending: true });

      const { data: recent, error: err1 } = await q1;
      if (err1) throw err1;

      const q2 = supabase
        .from("historical_call_cnts")
        .select("year, month:month_of_year, call_cnt, missed_call_cnt")
        .eq("helpline_id", helplineId)
        .lt("dateint", 20220301)
        .gte("dateint", 20210101)
        .order("year", { ascending: true })
        .order("month_of_year", { ascending: true });
      const { data: hist, error: err2 } = await q2;
      if (err2) throw err2;

      const joined = [...(hist || []), ...(recent || [])];
      const formattedData =
        joined.map((r) => ({
          call_cnt: r.call_cnt ?? 0,
          month: r.month ?? 0,
          year: r.year ?? 0,
        })) ?? [];

      const pivoted = tidy(
        formattedData,
        groupBy(["year", "month"], [summarize({ call_cnt: sum("call_cnt") })]),
        pivotWider({
          namesFrom: "year",
          valuesFrom: "call_cnt",
          valuesFill: 0,
        }),
        arrange(asc("month"))
      ).map((r) => ({
        ...r,
        month: monthNames[r.month - 1] as string,
      }));

      setData(pivoted);
    } catch (e) {
      setError(e as Error);
    } finally {
      setIsLoading(false);
    }
  }, [supabase, helplineId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return useMemo(
    () => ({ data, isLoading, error, refetch: fetchData }),
    [data, isLoading, error, fetchData]
  );
};
