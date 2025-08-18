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
    call_cnt:count(),
    missed_call_cnt:is_missed_call.sum()
  `
    )
    .eq("helpline_id", helplineId)
    .gte("dateint", 20220301);

  if (startDate) {
    query = query.gte("dateint", startDate);
  }
  query = query.order("year, month").limit(100000);
  const { data } = await query;

  let historicalQuery = supabase
    .from("historical_call_cnts")
    .select("year, month:month_of_year, call_cnt, missed_call_cnt")
    .eq("helpline_id", helplineId)
    .lt("dateint", 20220301);

  if (startDate) {
    historicalQuery = historicalQuery.gte("dateint", startDate);
  }
  historicalQuery = historicalQuery.order("year, month_of_year").limit(100000);

  const { data: historicalData } = await historicalQuery;
  const joinedData = [...(historicalData || []), ...(data || [])];
  const formattedData = joinedData.map((item) => ({
    ...item,
    connected_call_cnt: item.call_cnt - item.missed_call_cnt,
    dateint: `${item.year}-${item.month}-01`,
  }));
  return formattedData;
};
