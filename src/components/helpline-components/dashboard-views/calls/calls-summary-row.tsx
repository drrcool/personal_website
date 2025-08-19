import { useCallsSummaryRow } from "../../dataFetchers/useCallsSummaryRow";

import AbandonmentRateCard from "./abandonment-rate-card";
import AverageDurationCard from "./average-duration-card";
import MissedCallsCard from "./missed-calls-card";
import MostRecentCall from "./most-recent-call";
import TotalCallCard from "./total-call-card";

export interface CallsSummaryRowData {
  current_call_cnt: number;
  current_missed_call_cnt: number;
  year_ago_call_cnt: number;
  year_ago_missed_call_cnt: number;
  current_call_duration_avg: number;
  year_ago_call_duration_avg: number;
}
export interface CallsSummaryCardProps {
  data: CallsSummaryRowData;
  isLoading: boolean;
}

const CallsSummaryRow = () => {
  const { data } = useCallsSummaryRow();
  const isLoading = Object.keys(data).length === 0;
  return (
    <div id="summary-row">
      <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
        <MostRecentCall />
        <TotalCallCard data={data} isLoading={isLoading} />
        <MissedCallsCard data={data} isLoading={isLoading} />
        <AbandonmentRateCard data={data} isLoading={isLoading} />
        <AverageDurationCard data={data} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default CallsSummaryRow;
