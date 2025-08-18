"use client";
import { useHelplineId } from "../state/helpline-store";

import CallTimeSeries from "./calls/call-time-series";

const Calls = () => {
  const { helplineId } = useHelplineId();
  return (
    <div className="flex flex-col gap-5 p-5">
      <div>Calls</div>
      <div className="grid grid-cols-2">
        <CallTimeSeries helplineId={helplineId} />
      </div>
    </div>
  );
};

export default Calls;
