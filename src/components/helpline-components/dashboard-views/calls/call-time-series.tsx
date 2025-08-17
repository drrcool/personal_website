import { Card } from "@/components/ui/card";

import { getCallTimeSeries } from "../../dataFetchers/getCallTimeSeries";

const CallTimeSeries = async () => {
  const data = await getCallTimeSeries({ helplineId: "GSC" });
  return (
    <Card className="border-b">
      <div>CallTimeSeries</div>
    </Card>
  );
};

export default CallTimeSeries;
