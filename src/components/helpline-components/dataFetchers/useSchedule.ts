"use client";

import { fullJoin, tidy } from "@tidyjs/tidy";
import { useEffect, useMemo, useState, useCallback } from "react";

import { useSupabaseBrowser } from "../hooks/useSupabaseBrowser";
import {
  RELIABILITY_CUTOFF_DATEINT,
  type NeedTier,
} from "../metrics/constants";
import { computeHourlyNeed } from "../metrics/hourly-need";
import { computeOperatorReliability } from "../metrics/operator-reliability";
import { useHelplineStore } from "../state/helpline-store";

export interface ScheduleData {
  day_of_week: number;
  hour_of_day: number;
  operators_scheduled: number;
  assigned_operators: string;
  call_cnt: number;
  missed_call_cnt: number;
  missed_call_rate: number;
  /** Expected missed callers per week for this hour. */
  need_score: number;
  need_tier: NeedTier;
  calls_per_week: number;
}

export interface ScheduleSummary {
  call_cnt: number;
  missed_call_cnt: number;
  missed_call_rate: number;
  /** Σ need_score across every hour — expected missed callers per week, helpline-wide. */
  total_need_score: number;
}

export interface ScheduleDataWithSummary {
  schedule: Record<string, ScheduleData>;
  summary: ScheduleSummary;
}

const EMPTY_SUMMARY: ScheduleSummary = {
  call_cnt: 0,
  missed_call_cnt: 0,
  missed_call_rate: 0,
  total_need_score: 0,
};

/** Converts a YYYYMMDD integer to a Date at UTC midnight. */
const dateintToDate = (dateint: number): Date => {
  const year = Math.floor(dateint / 10000);
  const month = Math.floor((dateint % 10000) / 100);
  const day = dateint % 100;
  return new Date(Date.UTC(year, month - 1, day));
};

const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;

const weeksSince = (dateint: number): number => {
  const elapsed = Date.now() - dateintToDate(dateint).getTime();
  return Math.max(elapsed / MS_PER_WEEK, 1 / 7);
};

export const useSchedule = () => {
  const { helplineId, lastNDaysDateint } = useHelplineStore();
  const supabase = useSupabaseBrowser();
  const [data, setData] = useState<ScheduleDataWithSummary>({
    schedule: {},
    summary: EMPTY_SUMMARY,
  });

  const fetchData = useCallback(async () => {
    if (!helplineId) return;
    const { data: recent, error: err1 } = await supabase
      .from("hourly_schedule")
      .select(
        "day_of_week, hour_of_day, operators_scheduled, assigned_operators"
      )
      .eq("helpline_id", helplineId);
    if (err1) throw err1;

    const { data: operators, error: err2 } = await supabase
      .from("cleaned_calls")
      .select(
        "day_of_week, hour_of_day, call_cnt:count(), missed_call_cnt:is_missed_call.sum()"
      )
      .eq("helpline_id", helplineId)
      .gte("dateint", lastNDaysDateint);
    if (err2) throw err2;

    // Reliability is clamped to the assigned-operators cutoff regardless of the selected
    // window: before then `assigned_operators` was empty, so earlier rows would count
    // opportunities that were never recorded and understate every operator.
    const { data: reliabilityRows, error: err3 } = await supabase
      .from("cleaned_calls")
      .select("dateint, operator_name, assigned_operators")
      .eq("helpline_id", helplineId)
      .gte("dateint", RELIABILITY_CUTOFF_DATEINT);
    if (err3) throw err3;

    const reliability = computeOperatorReliability(reliabilityRows ?? []);
    const needResult = computeHourlyNeed({
      schedule: recent ?? [],
      calls: (operators ?? []).map((row) => ({
        day_of_week: row.day_of_week,
        hour_of_day: row.hour_of_day,
        call_cnt: row.call_cnt ?? 0,
        missed_call_cnt: row.missed_call_cnt ?? 0,
      })),
      weeksInWindow: weeksSince(lastNDaysDateint),
      reliability,
    });

    const joined = tidy(
      recent,
      fullJoin(operators, { by: ["day_of_week", "hour_of_day"] })
    );

    const recordData = joined.reduce(
      (acc, curr) => {
        const key = `${curr.day_of_week}-${curr.hour_of_day}`;
        const call_cnt = curr.call_cnt ?? 0;
        const missed_call_cnt = curr.missed_call_cnt ?? 0;
        const need = needResult.byCell.get(key);

        acc[key] = {
          ...curr,
          operators_scheduled: curr.operators_scheduled ?? 0,
          call_cnt,
          missed_call_cnt,
          assigned_operators: curr.assigned_operators ?? "--",
          missed_call_rate:
            call_cnt > 0 ? (100.0 * missed_call_cnt) / call_cnt : 0,
          need_score: need?.need_score ?? 0,
          need_tier: need?.need_tier ?? "none",
          calls_per_week: need?.calls_per_week ?? 0,
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
      { ...EMPTY_SUMMARY }
    );
    summary.total_need_score = needResult.totalNeedScore;

    setData({ schedule: recordData, summary });
  }, [supabase, helplineId, lastNDaysDateint]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return useMemo(
    () => ({ data, isLoading: Object.keys(data.schedule).length === 0 }),
    [data]
  );
};
