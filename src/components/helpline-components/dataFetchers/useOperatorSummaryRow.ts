"use client";
import { useCallback, useEffect, useState } from "react";

import { useSupabaseBrowser } from "../hooks/useSupabaseBrowser";
import { useHelplineStore } from "../state/helpline-store";

interface OperatorSummaryData {
  operator_cnt: number;
  average_coverage_time: number;
  max_coverage_time: number;
  total_calls_answered: number;
  total_duration_secs: number;
}

export const useOperatorSummaryRow = () => {
  const { helplineId, lastNDaysDateint } = useHelplineStore();
  const supabase = useSupabaseBrowser();
  const [data, setData] = useState<OperatorSummaryData>({
    operator_cnt: 0,
    average_coverage_time: 0,
    max_coverage_time: 0,
    total_calls_answered: 0,
    total_duration_secs: 0,
  });

  const fetchData = useCallback(async () => {
    if (!helplineId) return;
    const { data: operatorData, error } = await supabase
      .from("operator_schedule")
      .select("*")
      .eq("helpline_id", helplineId);
    if (error) throw error;
    const { data: callData, error: callError } = await supabase
      .from("cleaned_calls")
      .select(
        `
                call_cnt:dedup_key.count(),
                missed_call_cnt:is_missed_call.sum(),
                call_duration_secs:duration_seconds.sum()
        `
      )
      .eq("helpline_id", helplineId)
      .gte("dateint", lastNDaysDateint);
    if (callError) throw callError;
    const operators = operatorData.reduce(
      (acc, curr) => {
        const current_value = acc[curr.operator_name] ?? 0;
        acc[curr.operator_name] = current_value + 1;
        return acc;
      },
      {} as Record<string, number>
    );
    const total_hours = Object.values(operators).reduce(
      (acc, curr) => acc + curr,
      0
    );
    const max_coverage_time = Math.max(...Object.values(operators));
    const operator_cnt = Object.keys(operators).length;
    const aggData = {
      operator_cnt,
      average_coverage_time: total_hours / operator_cnt,
      max_coverage_time,
      total_calls_answered: callData.reduce(
        (acc, curr) => acc + curr.call_cnt - curr.missed_call_cnt,
        0
      ),
      total_duration_secs: callData.reduce(
        (acc, curr) => acc + curr.call_duration_secs,
        0
      ),
    };
    setData(aggData);
  }, [helplineId, lastNDaysDateint, supabase]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data };
};
