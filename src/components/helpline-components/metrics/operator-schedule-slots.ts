import { normalizeOperatorName } from "./constants";

export interface OperatorScheduleRow {
  operator_name: string | null;
  day_of_week: number;
  hour_of_day: number;
}

export interface ScheduleBlock {
  dayOfWeek: number;
  /** First scheduled hour of the block (24-hour clock). */
  startHour: number;
  /** One past the last scheduled hour — a 9, 10, 11 run reports 9 and 12. */
  endHour: number;
}

/**
 * Groups one operator's `operator_schedule` rows into contiguous per-day blocks, so a
 * shift covering hours 9, 10, 11 reads as one block ("9:00–12:00") rather than three
 * separate hours.
 *
 * Blocks never merge across a day boundary — a shift ending at hour 23 and another
 * starting at hour 0 the next day are adjacent in wall-clock time but distinct schedule
 * days, and merging them would misrepresent which day covers the late hour.
 */
export const groupOperatorScheduleBlocks = (
  rows: readonly OperatorScheduleRow[],
  operatorName: string
): ScheduleBlock[] => {
  const hoursByDay = new Map<number, Set<number>>();

  for (const row of rows) {
    if (normalizeOperatorName(row.operator_name) !== operatorName) continue;
    const hours = hoursByDay.get(row.day_of_week) ?? new Set<number>();
    hours.add(row.hour_of_day);
    hoursByDay.set(row.day_of_week, hours);
  }

  const blocks: ScheduleBlock[] = [];
  for (const [dayOfWeek, hourSet] of hoursByDay) {
    const hours = [...hourSet].sort((a, b) => a - b);
    let blockStart: number | undefined;
    let previous: number | undefined;

    const flush = (end: number) => {
      if (blockStart !== undefined) {
        blocks.push({ dayOfWeek, startHour: blockStart, endHour: end });
      }
    };

    for (const hour of hours) {
      if (previous !== undefined && hour !== previous + 1) {
        flush(previous + 1);
        blockStart = undefined;
      }
      if (blockStart === undefined) blockStart = hour;
      previous = hour;
    }
    if (previous !== undefined) flush(previous + 1);
  }

  return blocks.sort(
    (a, b) => a.dayOfWeek - b.dayOfWeek || a.startHour - b.startHour
  );
};
