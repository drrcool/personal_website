import LineChart from "../../charts/line-chart";
import { useYoYTimeSeries } from "../../dataFetchers/useYoYTimeSeries";
import SummaryCard from "../../layout/summary-card";

const CallsYoYPanel = ({ height = 500 }: { height?: number }) => {
  const { data, isLoading } = useYoYTimeSeries();
  const groups = Object.keys(data[0] ?? {})
    .map((item) => item)
    .filter((item) => item !== "month");
  return (
    <SummaryCard isLoading={isLoading} height={height} cardTitle="Calls YoY">
      <LineChart data={data} xKey="month" yKeys={groups} />
    </SummaryCard>
  );
};

export default CallsYoYPanel;
