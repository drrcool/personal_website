import BarChart from "../../charts/bar-chart";
import { useOperatorStats } from "../../dataFetchers/useOperatorStats";
import SummaryCard from "../../layout/summary-card";

const OperatorChart = ({
  data = [],
  isLoading,
  metricKey,
  title,
}: {
  data: object[] | undefined;
  isLoading: boolean;
  metricKey: string;
  title: string;
}) => {
  const typedKey = metricKey as keyof (typeof data)[0];
  const sortedData = [...data]
    .sort((a, b) => b[typedKey] - a[typedKey])
    .slice(0, 10);
  return (
    <SummaryCard isLoading={isLoading} height={400} cardTitle={title}>
      <BarChart data={sortedData} barKey="operator_name" valueKey={typedKey} />
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
        metricKey="missed_call_cnt"
        title="Missed Calls"
      />
      <OperatorChart
        data={data}
        isLoading={isLoading}
        metricKey="missed_call_rate"
        title="Missed Call Rate"
      />
    </div>
  );
};

export default OperatorStats;
