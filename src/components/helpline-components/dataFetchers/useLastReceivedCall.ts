import { useCallback, useEffect, useMemo, useState } from "react";

import { useSupabaseBrowser } from "../hooks/useSupabaseBrowser";
import type { HelplineID } from "../state/helpline-store";
interface LastCall {
  call_time: string | null;
  caller_state: string | null;
  duration_seconds: number | null;
  is_missed_call: number | null;
  operator_name: string | null;
}

export function useLastReceivedCall(helplineId: HelplineID) {
  const supabase = useSupabaseBrowser();
  const [data, setData] = useState<LastCall | null>(null);

  const fetchData = useCallback(async () => {
    const { data: lastCall } = await supabase
      .from("cleaned_calls")
      .select(
        "call_time, caller_state, duration_seconds, is_missed_call, operator_name"
      )
      .eq("helpline_id", helplineId)
      .order("call_time", { ascending: false })
      .limit(1);
    setData(lastCall?.[0] ?? null);
  }, [supabase, helplineId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return useMemo(() => ({ data, isLoading: data === null }), [data]);
}
