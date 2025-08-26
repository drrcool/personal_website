import StackedArea from "../../charts/stacked-area";
import { useCallTimeSeries } from "../../dataFetchers/useCallTimeSeries";
import SummaryCard from "../../layout/summary-card";

const CallTimeSeries = ({ height = 500 }: { height?: number }) => {
  const { data, isLoading } = useCallTimeSeries();
  const nameMap = {
    connected_call_cnt: "Connected Calls",
    assigned_missed_call_cnt: "Assigned Missed Calls",
    unassigned_missed_call_cnt: "Unassigned Missed Calls",
  };
  const colorMap = {
    connected_call_cnt: "var(--color-semantic-success)",
    assigned_missed_call_cnt: "var(--color-semantic-failure)",
    unassigned_missed_call_cnt: "var(--color-semantic-warning)",
  };
  return (
    <SummaryCard isLoading={isLoading} height={height} cardTitle="Call Volume">
      <StackedArea
        data={data}
        xKey="dateint"
        yKey={[
          "connected_call_cnt",
          "assigned_missed_call_cnt",
          "unassigned_missed_call_cnt",
        ]}
        nameMap={nameMap}
        colorMap={colorMap}
      />
    </SummaryCard>
  );
};

export default CallTimeSeries;
