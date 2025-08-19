"use client";

import { useEffect, useMemo, useState, useCallback } from "react";

import { useSupabaseBrowser } from "../hooks/useSupabaseBrowser";
import { useHelplineStore } from "../state/helpline-store";

interface Point {
  current_call_cnt: number;
  current_missed_call_cnt: number;
  year_ago_call_cnt: number;
  year_ago_missed_call_cnt: number;
}

const dateToDateInt = (date: Date) => {
  const dateSplit = date.toISOString().split("T")?.[0] as string;
  return parseInt(dateSplit?.replace(/-/g, ""));
};

export const useCallsSummaryRow = () => {
  const { helplineId, lastNDaysDateint } = useHelplineStore();
  const supabase = useSupabaseBrowser();
  const [data, setData] = useState<Point>({} as Point);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!helplineId) return;
    setIsLoading(true);
    setError(null);
    try {
      const getBaseQuery = (type: "current" | "year_ago") => {
        const baseQuery = supabase
          .from("cleaned_calls")
          .select(
            `
          ${type}_call_cnt:count(),
          ${type}_missed_call_cnt:is_missed_call.sum()
        `
          )
          .eq("helpline_id", helplineId);
        return baseQuery;
      };

      const today = dateToDateInt(new Date());
      const q1 = getBaseQuery("current")
        .gte("dateint", lastNDaysDateint)
        .lte("dateint", today);
      const { data: recent, error: err1 } = await q1;
      if (err1) throw err1;

      const YEAR_AGO_DATEINT_INCREMENT = 10000;
      const q2 = getBaseQuery("year_ago")
        .lt("dateint", today - YEAR_AGO_DATEINT_INCREMENT)
        .gte("dateint", lastNDaysDateint - YEAR_AGO_DATEINT_INCREMENT);

      const { data: hist, error: err2 } = await q2;
      if (err2) throw err2;

      const combined = {
        ...recent[0],
        ...hist[0],
      } as Point;
      setData(combined);
    } catch (e) {
      setError(e as Error);
    } finally {
      setIsLoading(false);
    }
  }, [supabase, helplineId, lastNDaysDateint]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return useMemo(
    () => ({ data, isLoading, error, refetch: fetchData }),
    [data, isLoading, error, fetchData]
  );
};
