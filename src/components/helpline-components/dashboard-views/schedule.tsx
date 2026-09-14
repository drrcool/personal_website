"use client";
import { HelplineToolsBar } from "../layout/helpline-tools-bar";

import ScheduleGrid from "./schedule/schedule-grid";
import ScheduleSummaryRow from "./schedule/schedule-summary";
import { ReliabilityWindowNote } from "./schedule/utils/reliability-window-note";

const Schedule = () => {
  return (
    <div className="flex flex-col gap-5 p-5">
      <HelplineToolsBar title="Schedule Insight" showMetricSelector />
      <ReliabilityWindowNote />
      <ScheduleSummaryRow />
      <ScheduleGrid />
    </div>
  );
};

export default Schedule;
