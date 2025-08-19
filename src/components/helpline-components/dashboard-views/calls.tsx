"use client";
import { LastNDaysSelector } from "../inputs/last-n-days-selector";
import { useHelplineStore } from "../state/helpline-store";

import CallTimeSeries from "./calls/call-time-series";
import MostRecentCall from "./calls/most-recent-call";

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
      <div id="summary-row">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MostRecentCall />
        </div>
      </div>
      <div className="grid grid-cols-2">
        <CallTimeSeries />
      </div>
    </div>
  );
};

export default Calls;
