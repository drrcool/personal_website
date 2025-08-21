"use client";

import { useCallback, useEffect, useState } from "react";

import { useSupabaseBrowser } from "../hooks/useSupabaseBrowser";
import { useHelplineStore } from "../state/helpline-store";

interface OperatorStats {
  operator_name: string;
  assigned_call: number;
  connected_call_cnt: number;
  missed_call_cnt: number;
  total_duration_secs: number;
  avg_duration_secs: number;
  missed_call_rate: number;
}

export const useOperatorStats = () => {
  const { helplineId, lastNDaysDateint } = useHelplineStore();
  const supabase = useSupabaseBrowser();
  const [data, setData] = useState<OperatorStats[] | undefined>(undefined);

  const fetchData = useCallback(async () => {
    if (!helplineId) return;
    const { data, error } = await supabase
      .from("cleaned_calls")
      .select(
        `
         operator_name,
         is_missed_call,
         assigned_operators,
         duration_seconds
         `
      )
      .eq("helpline_id", helplineId)
      .gte("dateint", lastNDaysDateint);
    if (error) throw error;

    const emptyOutput = {
      operator_name: "--",
      assigned_call: 0,
      connected_call_cnt: 0,
      missed_call_cnt: 0,
      total_duration_secs: 0,
    };
    const groupedData = data.reduce(
      (acc, row) => {
        const assignedOperators = row.assigned_operators
          .split(",")
          .map((oper) => oper.trim());
        const answeredOperator = row.operator_name;
        assignedOperators.forEach((oper) => {
          if (oper === "---" || oper === "--") return;
          if (acc[oper]) {
            acc[oper].assigned_call++;
            acc[oper].missed_call_cnt += row.is_missed_call;
          } else {
            acc[oper] = {
              ...emptyOutput,
              operator_name: oper,
              assigned_call: 1,
              missed_call_cnt: row.is_missed_call,
            };
          }
        });
        if (answeredOperator !== "---" && answeredOperator !== "--") {
          if (acc[answeredOperator]) {
            acc[answeredOperator].connected_call_cnt++;
            acc[answeredOperator].total_duration_secs += row.duration_seconds;
          } else {
            acc[answeredOperator] = {
              ...emptyOutput,
              operator_name: answeredOperator,
              connected_call_cnt: 1,
              total_duration_secs: row.duration_seconds,
            };
          }
        }
        return acc;
      },
      {} as Record<string, typeof emptyOutput>
    );

    const outputData = Object.values(groupedData).map((row) => ({
      ...row,
      avg_duration_secs:
        row.connected_call_cnt > 0
          ? row.total_duration_secs / row.connected_call_cnt
          : 0,
      missed_call_rate:
        row.assigned_call > 0
          ? (100.0 * row.missed_call_cnt) / row.assigned_call
          : 0,
    }));
    setData(outputData);
  }, [helplineId, lastNDaysDateint, supabase]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data };
};
