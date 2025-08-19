"use client";
import { HelplineToolsBar } from "../layout/helpline-tools-bar";

import CallTimeSeries from "./calls/call-time-series";
import CallsSummaryRow from "./calls/calls-summary-row";
import CallsYoYPanel from "./calls/calls-yoy-panel";

const Calls = () => {
  return (
    <div className="flex flex-col gap-5 p-5">
      <HelplineToolsBar title="Call Analytics" />
      <CallsSummaryRow />
      <div className="grid grid-cols-2 gap-4">
        <CallTimeSeries />
        <CallsYoYPanel />
      </div>
    </div>
  );
};

export default Calls;
