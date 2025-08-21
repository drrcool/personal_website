import BarChart from "../../charts/bar-chart";
import {
  type OperatorStats as OperatorStatsType,
  useOperatorStats,
} from "../../dataFetchers/useOperatorStats";
import SummaryCard from "../../layout/summary-card";

const OperatorChart = ({
  data = [],
  isLoading,
  metricKey,
  title,
  subMetricKey,
  maxEntries = 12,
}: {
  data: OperatorStatsType[] | undefined;
  isLoading: boolean;
  metricKey: string;
  subMetricKey?: string;
  title: string;
  maxEntries?: number;
}) => {
  const typedKey = metricKey as keyof Omit<OperatorStatsType, "operator_name">;
  const sortedData = [...data]
    .sort((a, b) => b[typedKey] - a[typedKey])
    .slice(0, maxEntries);

  const tooltipContent = (row: OperatorStatsType) => {
    return (
      <div className="flex flex-col gap-4 p-3 rounded-md z-[1000] justify-between w-50 bg-card text-card-foreground border border-accent-foreground">
        <div className="text-sm  font-bold">{row.operator_name}</div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-row justify-between items-center">
            <div className="text-sm font-bold">Answered Calls</div>
            <div className="text-sm font-medium">{row.connected_call_cnt}</div>
          </div>

          <div className="flex flex-row justify-between items-center">
            <div className="text-sm font-bold">Missed Calls</div>
            <div className="text-sm font-medium">{row.missed_call_cnt}</div>
          </div>
          <div className="flex flex-row justify-between items-center">
            <div className="text-sm font-bold">Missed Call Rate</div>
            <div className="text-sm font-medium">
              {row.missed_call_rate.toFixed(0)}%
            </div>
          </div>
          <div className="flex flex-row justify-between items-center">
            <div className="text-sm font-bold">Total Duration</div>
            <div className="text-sm font-medium">
              {(row.total_duration_secs / 60).toFixed(1)} min
            </div>
          </div>
        </div>
      </div>
    );
  };
  return (
    <SummaryCard isLoading={isLoading} height={400} cardTitle={title}>
      <BarChart
        data={sortedData}
        barKey="operator_name"
        valueKey={typedKey}
        subMetricKey={subMetricKey}
        tooltipContent={tooltipContent}
      />
    </SummaryCard>
  );
};

const OperatorStats = () => {
  const { data } = useOperatorStats();
  const isLoading = data === undefined;
  return (
    <div className="grid grid-cols-2 gap-4">
      <OperatorChart
        data={data}
        isLoading={isLoading}
        metricKey="connected_call_cnt"
        title="Answered Calls"
      />
      <OperatorChart
        data={data}
        isLoading={isLoading}
        metricKey="avg_duration_secs"
        title="Average Call Duration"
      />
      <OperatorChart
        data={data}
        isLoading={isLoading}
        metricKey="missed_call_rate"
        title="Missed Call Rate"
      />
      <OperatorChart
        data={data}
        isLoading={isLoading}
        metricKey="missed_call_cnt"
        title="Missed Calls"
      />
    </div>
  );
};

export default OperatorStats;
