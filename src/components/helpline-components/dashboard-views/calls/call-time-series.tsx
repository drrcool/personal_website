import StackedArea from "../../charts/stacked-area";
import { useCallTimeSeries } from "../../dataFetchers/useCallTimeSeries";
import SummaryCard from "../../layout/summary-card";
import type { HelplineID } from "../../state/helpline-store";

const CallTimeSeries = ({
  helplineId,
  height = 500,
}: {
  helplineId: HelplineID;
  height?: number;
}) => {
  const { data, isLoading } = useCallTimeSeries({ helplineId });
  const nameMap = {
    connected_call_cnt: "Connected Calls",
    missed_call_cnt: "Missed Calls",
  };
  return (
    <SummaryCard isLoading={isLoading} height={height} cardTitle="Call Volume">
      <StackedArea
        data={data}
        xKey="dateint"
        yKey={["connected_call_cnt", "missed_call_cnt"]}
        nameMap={nameMap}
      />
    </SummaryCard>
  );
};

export default CallTimeSeries;
