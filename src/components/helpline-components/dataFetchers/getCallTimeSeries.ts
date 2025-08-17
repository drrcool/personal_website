import { groupBy, sum, summarize, tidy } from "@tidyjs/tidy";

import { createClient } from "@/lib/supabase";

interface UseCallTimeSeriesProps {
  startDate?: string;
  helplineId: string;
}
export const getCallTimeSeries = async ({
  startDate,
  helplineId,
}: UseCallTimeSeriesProps) => {
  const supabase = await createClient();
  if (!supabase) return [];
  let query = supabase
    .from("cleaned_calls")
    .select(
      `
    month, year,
    is_missed_call
  `
    )
    .eq("helpline_id", helplineId);

  if (startDate) {
    query = query.gte("call_time", startDate);
  }
  query = query.limit(10000);
  const { data } = await query;

  if (!data) return [];
  const outputData = tidy(
    data,
    groupBy(
      ["month", "year"],
      [
        summarize({
          call_cnt: (items) => items.length,
          missed_call_cnt: sum("is_missed_call"),
        }),
      ]
    )
  );

  return outputData;
};
