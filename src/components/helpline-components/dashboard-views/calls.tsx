"use client";
import { LastNDaysSelector } from "../inputs/last-n-days-selector";
import { useHelplineStore } from "../state/helpline-store";

import CallTimeSeries from "./calls/call-time-series";
import CallsSummaryRow from "./calls/calls-summary-row";
import CallsYoYPanel from "./calls/calls-yoy-panel";

const Calls = () => {
  const { lastNDays, setLastNDays } = useHelplineStore();
  return (
    <div className="flex flex-col gap-5 p-5">
      <div className="p-4">
        <div className="tool-row flex flex-row gap-5 justify-between items-center">
          <div className="font-bold text-2xl">Call Analytics</div>
          <div className="flex flex-row gap-5">
            <LastNDaysSelector
              value={lastNDays}
              setValue={setLastNDays}
              title="Stat Range"
            />
          </div>
        </div>
      </div>
      <CallsSummaryRow />
      <div className="grid grid-cols-2 gap-4">
        <CallTimeSeries />
        <CallsYoYPanel />
      </div>
    </div>
  );
};

export default Calls;
