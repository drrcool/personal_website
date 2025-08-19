"use client";
import { HelplineToolsBar } from "../layout/helpline-tools-bar";

import ScheduleGrid from "./calls/schedule/schedule-grid";

const Schedule = () => {
  return (
    <div className="flex flex-col gap-5 p-5">
      <HelplineToolsBar title="Schedule Insight" />
      <ScheduleGrid />
    </div>
  );
};

export default Schedule;
