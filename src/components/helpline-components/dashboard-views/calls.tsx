"use client";
import { useHelplineId } from "../state/helpline-store";

import CallTimeSeries from "./calls/call-time-series";
import MostRecentCall from "./calls/most-recent-call";

const Calls = () => {
  const { helplineId } = useHelplineId();
  return (
    <div className="flex flex-col gap-5 p-5">
      <div id="summary-row">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MostRecentCall helplineId={helplineId} />
        </div>
      </div>
      <div className="grid grid-cols-1">
        <CallTimeSeries helplineId={helplineId} />
      </div>
    </div>
  );
};

export default Calls;
