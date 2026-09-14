import { describe, expect, it } from "vitest";

import {
  groupOperatorScheduleBlocks,
  type OperatorScheduleRow,
} from "./operator-schedule-slots";

const row = (
  operator_name: string,
  day_of_week: number,
  hour_of_day: number
): OperatorScheduleRow => ({ operator_name, day_of_week, hour_of_day });

describe("groupOperatorScheduleBlocks", () => {
  it("merges consecutive hours on the same day into one block", () => {
    const blocks = groupOperatorScheduleBlocks(
      [row("A", 1, 9), row("A", 1, 10), row("A", 1, 11)],
      "A"
    );
    expect(blocks).toEqual([{ dayOfWeek: 1, startHour: 9, endHour: 12 }]);
  });

  it("splits non-consecutive hours on the same day into separate blocks", () => {
    const blocks = groupOperatorScheduleBlocks(
      [row("A", 1, 9), row("A", 1, 14)],
      "A"
    );
    expect(blocks).toEqual([
      { dayOfWeek: 1, startHour: 9, endHour: 10 },
      { dayOfWeek: 1, startHour: 14, endHour: 15 },
    ]);
  });

  it("does not merge across a day boundary", () => {
    const blocks = groupOperatorScheduleBlocks(
      [row("A", 0, 23), row("A", 1, 0)],
      "A"
    );
    expect(blocks).toEqual([
      { dayOfWeek: 0, startHour: 23, endHour: 24 },
      { dayOfWeek: 1, startHour: 0, endHour: 1 },
    ]);
  });

  it("only includes the requested operator", () => {
    const blocks = groupOperatorScheduleBlocks(
      [row("A", 1, 9), row("B", 1, 10)],
      "A"
    );
    expect(blocks).toEqual([{ dayOfWeek: 1, startHour: 9, endHour: 10 }]);
  });

  it("sorts blocks by day then start hour", () => {
    const blocks = groupOperatorScheduleBlocks(
      [row("A", 2, 5), row("A", 0, 9), row("A", 0, 3)],
      "A"
    );
    expect(blocks).toEqual([
      { dayOfWeek: 0, startHour: 3, endHour: 4 },
      { dayOfWeek: 0, startHour: 9, endHour: 10 },
      { dayOfWeek: 2, startHour: 5, endHour: 6 },
    ]);
  });

  it("returns nothing for an unscheduled operator", () => {
    expect(groupOperatorScheduleBlocks([row("A", 1, 9)], "B")).toEqual([]);
  });

  it("de-duplicates repeated rows for the same hour", () => {
    const blocks = groupOperatorScheduleBlocks(
      [row("A", 1, 9), row("A", 1, 9)],
      "A"
    );
    expect(blocks).toEqual([{ dayOfWeek: 1, startHour: 9, endHour: 10 }]);
  });
});
