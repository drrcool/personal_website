import { Card } from "@/components/ui/card";

import StackedArea from "../../charts/stacked-area";
import { useCallTimeSeries } from "../../dataFetchers/useCallTimeSeries";
import type { HelplineID } from "../../state/helpline-store";

const CallTimeSeries = ({ helplineId }: { helplineId: HelplineID }) => {
  const { data } = useCallTimeSeries({ helplineId });
  const nameMap = {
    connected_call_cnt: "Connected Calls",
    missed_call_cnt: "Missed Calls",
  };
  return (
    <Card className="p-4 text-card">
      <div className="flex flex-col gap-2">
        <div className="text-lg font-bold text-card-foreground">
          Call Volume
        </div>
        <div>
          <StackedArea
            data={data}
            xKey="dateint"
            yKey={["connected_call_cnt", "missed_call_cnt"]}
            nameMap={nameMap}
            yAxisLabel="Calls"
          />
        </div>
      </div>
    </Card>
  );
};

export default CallTimeSeries;
