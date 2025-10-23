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

const getMonthReportDates = (reportMonth: number, reportYear: number) => {
  const currentStartDate = Number(
    `${reportYear}${String(reportMonth).padStart(2, "0")}01`
  );
  const currentEndDate = Number(
    `${reportYear}${String(reportMonth).padStart(2, "0")}31`
  );
  const pastStartDate = currentStartDate - 10000;
  const pastEndDate = currentEndDate - 10000;
  return { currentStartDate, currentEndDate, pastStartDate, pastEndDate };
};

const getYearReportDates = (reportMonth: number, reportYear: number) => {
  // The report should start the first day of the month after the report month on the previous year
  const previousMonth = reportMonth === 12 ? 1 : reportMonth + 1;
  const previousYear = reportMonth === 12 ? reportYear - 2 : reportYear - 1;
  const currentStartDate = Number(
    `${previousYear}${String(previousMonth).padStart(2, "0")}01`
  );
  const currentEndDate = Number(
    `${reportYear}${String(reportMonth).padStart(2, "0")}31`
  );
  const pastStartDate = currentStartDate - 10000;
  const pastEndDate = currentEndDate - 10000;
  return { currentStartDate, currentEndDate, pastStartDate, pastEndDate };
};

export const useReportData = () => {
  const { helplineId, reportType, reportMonth, reportYear } =
    useHelplineStore();

  const { currentStartDate, currentEndDate, pastStartDate, pastEndDate } =
    reportType === "month"
      ? getMonthReportDates(reportMonth, reportYear)
      : getYearReportDates(reportMonth, reportYear);
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

  return { data, currentStartDate, currentEndDate, pastStartDate, pastEndDate };
};
