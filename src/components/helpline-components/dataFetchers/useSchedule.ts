"use client";

import { fullJoin, tidy } from "@tidyjs/tidy";
import { useEffect, useMemo, useState, useCallback } from "react";

import { useSupabaseBrowser } from "../hooks/useSupabaseBrowser";
import { useHelplineStore } from "../state/helpline-store";

export interface ScheduleData {
  day_of_week: number;
  hour_of_day: number;
  operators_scheduled: number;
  assigned_operators: string;
  call_cnt: number;
  missed_call_cnt: number;
  missed_call_rate: number;
}

export interface ScheduleSummary {
  call_cnt: number;
  missed_call_cnt: number;
  missed_call_rate: number;
}

export interface ScheduleDataWithSummary {
  schedule: Record<string, ScheduleData>;
  summary: ScheduleSummary;
}

export const useSchedule = () => {
  const { helplineId, lastNDaysDateint } = useHelplineStore();
  const supabase = useSupabaseBrowser();
  const [data, setData] = useState<ScheduleDataWithSummary>({
    schedule: {},
    summary: { call_cnt: 0, missed_call_cnt: 0, missed_call_rate: 0 },
  });

  const fetchData = useCallback(async () => {
    if (!helplineId) return;
    const q1 = supabase
      .from("hourly_schedule")
      .select(
        "day_of_week, hour_of_day, operators_scheduled, assigned_operators"
      )
      .eq("helpline_id", helplineId);

    const { data: recent, error: err1 } = await q1;
    if (err1) throw err1;

    const { data: operators, error: err2 } = await supabase
      .from("cleaned_calls")
      .select(
        "day_of_week, hour_of_day, call_cnt:count(), missed_call_cnt:is_missed_call.sum()"
      )
      .eq("helpline_id", helplineId)
      .gte("dateint", lastNDaysDateint);
    if (err2) throw err2;
    const joined = tidy(
      recent,
      fullJoin(operators, { by: ["day_of_week", "hour_of_day"] })
    );

    const recordData = joined.reduce(
      (acc, curr) => {
        const key = `${curr.day_of_week}-${curr.hour_of_day}`;
        const call_cnt = curr.call_cnt ?? 0;
        const missed_call_cnt = curr.missed_call_cnt ?? 0;

        acc[key] = {
          ...curr,
          operators_scheduled: curr.operators_scheduled ?? 0,
          call_cnt: curr.call_cnt ?? 0,
          missed_call_cnt: curr.missed_call_cnt ?? 0,
          assigned_operators: curr.assigned_operators ?? "--",
          missed_call_rate:
            call_cnt > 0 ? (100.0 * missed_call_cnt) / call_cnt : 0,
        };
        return acc;
      },
      {} as Record<string, ScheduleData>
    );

    const summary = Object.values(recordData).reduce(
      (acc, curr) => {
        acc.call_cnt = Math.max(acc.call_cnt, curr.call_cnt);
        acc.missed_call_cnt = Math.max(
          acc.missed_call_cnt,
          curr.missed_call_cnt
        );
        acc.missed_call_rate = Math.max(
          acc.missed_call_rate,
          curr.missed_call_rate
        );
        return acc;
      },
      { call_cnt: 0, missed_call_cnt: 0, missed_call_rate: 0 }
    );

    setData({ schedule: recordData, summary });
  }, [supabase, helplineId, lastNDaysDateint]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return useMemo(
    () => ({ data, isLoading: Object.keys(data).length === 0 }),
    [data]
  );
};
