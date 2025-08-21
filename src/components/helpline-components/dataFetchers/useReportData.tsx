"use client";

import { useCallback, useEffect, useState } from "react";

import { useSupabaseBrowser } from "../hooks/useSupabaseBrowser";
import { useHelplineStore } from "../state/helpline-store";

export interface ReportData {
  call_cnt: number;
  missed_call_cnt: number;
  past_call_cnt: number;
  past_missed_call_cnt: number;
}

export const useReportData = () => {
  const { helplineId, reportType, reportMonth, reportYear } =
    useHelplineStore();

  const currentStartDate =
    reportType === "month"
      ? Number(`${reportYear}${String(reportMonth).padStart(2, "0")}01`)
      : Number(`${reportYear - 1}${String(reportMonth).padStart(2, "0")}01`);

  const currentEndDate = Number(
    `${reportYear}${String(reportMonth).padStart(2, "0")}31`
  );
  const pastStartDate = currentStartDate - 10000;
  const pastEndDate = currentStartDate - 10000;

  const supabase = useSupabaseBrowser();
  const [data, setData] = useState<ReportData[]>([
    {
      call_cnt: 0,
      missed_call_cnt: 0,
      past_call_cnt: 0,
      past_missed_call_cnt: 0,
    },
  ]);

  const fetchData = useCallback(async () => {
    const { data: current, error: err1 } = await supabase
      .from("cleaned_calls")
      .select("call_cnt:count(), missed_call_cnt:is_missed_call.sum()")
      .eq("helpline_id", helplineId)
      .gte("dateint", currentStartDate)
      .lte("dateint", currentEndDate);

    const { data: past, error: err2 } = await supabase
      .from("cleaned_calls")
      .select(
        "past_call_cnt:count(), past_missed_call_cnt:is_missed_call.sum()"
      )
      .eq("helpline_id", helplineId)
      .gte("dateint", pastStartDate)
      .lte("dateint", pastEndDate);
    console.log(current);
    console.log(past);
    if (!current || err1) throw err1;
    if (!past || err2) throw err2;
    const merged = current.map((item, index) => ({
      ...item,
      past_call_cnt: past?.[index]?.past_call_cnt ?? 0,
      past_missed_call_cnt: past?.[index]?.past_missed_call_cnt ?? 0,
    }));

    setData(merged);
  }, [
    supabase,
    currentStartDate,
    currentEndDate,
    pastStartDate,
    pastEndDate,
    helplineId,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return data;
};
