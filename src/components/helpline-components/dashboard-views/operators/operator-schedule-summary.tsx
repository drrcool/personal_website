"use client";

import { useMemo } from "react";

import {
  groupOperatorScheduleBlocks,
  type OperatorScheduleRow,
} from "../../metrics/operator-schedule-slots";
import { dayMap } from "../schedule/utils/schedule-grid-utils";

const formatHour = (hour: number) => `${hour}:00`;

/**
 * The days and hours an operator is scheduled for, grouped into contiguous blocks — a
 * "9, 10, 11" run of hours reads as one "9:00–12:00" block rather than three separate ones.
 */
export const OperatorScheduleSummary = ({
  scheduleRows,
  operatorName,
}: {
  scheduleRows: readonly OperatorScheduleRow[];
  operatorName: string;
}) => {
  const blocks = useMemo(
    () => groupOperatorScheduleBlocks(scheduleRows, operatorName),
    [scheduleRows, operatorName]
  );

  if (blocks.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        Not currently on the schedule.
      </div>
    );
  }

  return (
    <div className="flex flex-row flex-wrap gap-2">
      {blocks.map((block) => (
        <span
          key={`${block.dayOfWeek}-${block.startHour}`}
          className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-bold text-muted-foreground whitespace-nowrap"
        >
          {dayMap[block.dayOfWeek as keyof typeof dayMap]}
          <span className="font-normal">
            {formatHour(block.startHour)}–{formatHour(block.endHour)}
          </span>
        </span>
      ))}
    </div>
  );
};

export default OperatorScheduleSummary;
