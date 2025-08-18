import { Card } from "@/components/ui/card";

import StackedArea from "../../charts/stacked-area";
import { getCallTimeSeries } from "../../dataFetchers/getCallTimeSeries";

const CallTimeSeries = async () => {
  const data = await getCallTimeSeries({ helplineId: "GSC" });
  return (
    <Card className="p-4 text-card">
      <StackedArea
        data={data as unknown as Array<Record<string, number>>}
        xKey="dateint"
        yKey={["call_cnt", "missed_call_cnt"]}
      />
    </Card>
  );
};

export default CallTimeSeries;
