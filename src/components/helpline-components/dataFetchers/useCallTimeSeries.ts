"use client";

import { useEffect, useMemo, useState, useCallback } from "react";

import { useSupabaseBrowser } from "../hooks/useSupabaseBrowser";
import { useHelplineStore } from "../state/helpline-store";

interface Point {
  call_cnt: number;
  assigned_missed_call_cnt: number;
  unassigned_missed_call_cnt: number;
  connected_call_cnt: number;
  dateint: string;
}

export function useCallTimeSeries() {
  const { helplineId, timeseriesStartDate } = useHelplineStore();
  const supabase = useSupabaseBrowser();
  const [data, setData] = useState<Point[]>([]);

  const fetchData = useCallback(async () => {
    if (!helplineId) return;
    let q1 = supabase
      .from("calls_time_series")
      .select(
        `
          month, year,
          call_cnt:call_cnt.sum(),
          assigned_missed_call_cnt:assigned_missed_call.sum(),
          unassigned_missed_call_cnt:unassigned_missed_call.sum()
        `
      )
      .eq("helpline_id", helplineId);

    if (timeseriesStartDate) q1 = q1.gte("dateint", timeseriesStartDate);
    q1 = q1
      .order("year", { ascending: true })
      .order("month", { ascending: true });
    const { data: recent, error: err1 } = await q1;
    if (err1) throw err1;
    const data: Point[] = recent.map((row) => ({
      ...row,
      connected_call_cnt:
        row.call_cnt -
        row.assigned_missed_call_cnt -
        row.unassigned_missed_call_cnt,
      dateint: `${row.year}-${String(row.month).padStart(2, "0")}-01`,
    }));
    setData(data);
  }, [supabase, helplineId, timeseriesStartDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return useMemo(() => ({ data, isLoading: data.length === 0 }), [data]);
}
