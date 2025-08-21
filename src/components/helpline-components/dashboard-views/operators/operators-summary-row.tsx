import { useOperatorSummaryRow } from "../../dataFetchers/useOperatorSummaryRow";
import { ScheduleSummaryCard } from "../schedule/schedule-summary";

const OperatorSummaryRow = () => {
  const { data } = useOperatorSummaryRow();

  return (
    <div className="grid grid-cols-5 gap-4">
      <ScheduleSummaryCard title="Total Operators" value={data.operator_cnt} />
      <ScheduleSummaryCard
        title="Avg Commitment"
        value={data.average_coverage_time.toFixed(1)}
      />
      <ScheduleSummaryCard
        title="Max Commitment"
        value={data.max_coverage_time}
      />
      <ScheduleSummaryCard
        title="Total Calls Answered"
        value={data.total_calls_answered}
      />
      <ScheduleSummaryCard
        title="Total Duration"
        value={`${(data.total_duration_secs / 24 / 3600).toFixed(1)} days`}
      />
    </div>
  );
};

export default OperatorSummaryRow;
