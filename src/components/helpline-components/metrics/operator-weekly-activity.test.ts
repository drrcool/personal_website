import { describe, expect, it } from "vitest";

import { WEEKLY_ACTIVITY_WEEKS } from "./constants";
import {
  computeOperatorWeeklyActivity,
  weeklyAnswerTier,
  type WeeklyActivityCallRow,
} from "./operator-weekly-activity";

const NOW = Date.parse("2026-09-11T12:00:00Z");
const MS_PER_DAY = 24 * 60 * 60 * 1000;

const daysAgo = (n: number) => new Date(NOW - n * MS_PER_DAY).toISOString();
const dateintOf = (iso: string) => Number(iso.slice(0, 10).replace(/-/g, ""));

const call = (
  assigned: string,
  answeredBy: string | null,
  agoDays: number
): WeeklyActivityCallRow => {
  const call_time = daysAgo(agoDays);
  return {
    call_time,
    dateint: dateintOf(call_time),
    operator_name: answeredBy ?? "---",
    assigned_operators: assigned,
  };
};

const run = (calls: WeeklyActivityCallRow[], operatorName = "A") =>
  computeOperatorWeeklyActivity({ calls, operatorName, now: NOW });

describe("computeOperatorWeeklyActivity", () => {
  it("returns 52 weeks oldest to newest", () => {
    const weeks = run([]);
    expect(weeks).toHaveLength(WEEKLY_ACTIVITY_WEEKS);
    expect(weeks[0]?.weeksAgo).toBe(WEEKLY_ACTIVITY_WEEKS - 1);
    expect(weeks.at(-1)?.weeksAgo).toBe(0);
  });

  it("counts a call in the most recent week as rung and answered", () => {
    const weeks = run([call("A", "A", 2)]);
    const thisWeek = weeks.at(-1)!;
    expect(thisWeek.rang).toBe(1);
    expect(thisWeek.answered).toBe(1);
    expect(thisWeek.answerRate).toBe(1);
    expect(thisWeek.tier).toBe("good");
  });

  it("counts a missed call as rung but not answered", () => {
    const weeks = run([call("A", null, 2)]);
    const thisWeek = weeks.at(-1)!;
    expect(thisWeek.rang).toBe(1);
    expect(thisWeek.answered).toBe(0);
    expect(thisWeek.answerRate).toBe(0);
    expect(thisWeek.tier).toBe("poor");
  });

  it("only counts calls that rang the requested operator", () => {
    const weeks = run([call("B", "B", 2)], "A");
    expect(weeks.every((w) => w.rang === 0)).toBe(true);
  });

  it("buckets by trailing week, not calendar week", () => {
    const weeks = run([call("A", "A", 6), call("A", "A", 8)]);
    expect(weeks.at(-1)?.rang).toBe(1); // 6 days ago: within the last 7 days
    expect(weeks.at(-2)?.rang).toBe(1); // 8 days ago: the week before
  });

  it("gives a week with no opportunity an undefined rate and 'none' tier", () => {
    const weeks = run([]);
    const week = weeks[0]!;
    expect(week.answerRate).toBeUndefined();
    expect(week.tier).toBe("none");
  });

  it("excludes calls before the reliability cutoff even if inside the trailing year", () => {
    const stale: WeeklyActivityCallRow = {
      call_time: "2024-01-01T00:00:00Z",
      dateint: 20240101,
      operator_name: "A",
      assigned_operators: "A",
    };
    const weeks = run([stale]);
    expect(weeks.every((w) => w.rang === 0)).toBe(true);
  });

  it("excludes calls older than the 52-week window", () => {
    const tooOld = call("A", "A", WEEKLY_ACTIVITY_WEEKS * 7 + 10);
    const weeks = run([tooOld]);
    expect(weeks.every((w) => w.rang === 0)).toBe(true);
  });

  it("does not double count an operator listed twice in assigned_operators", () => {
    const weeks = run([call("A,A", "A", 2)]);
    expect(weeks.at(-1)?.rang).toBe(1);
  });
});

describe("weeklyAnswerTier", () => {
  it("maps undefined to none", () => {
    expect(weeklyAnswerTier(undefined)).toBe("none");
  });

  it("maps a low rate to poor", () => {
    expect(weeklyAnswerTier(0.1)).toBe("poor");
  });

  it("maps a middling rate to ok", () => {
    expect(weeklyAnswerTier(0.35)).toBe("ok");
  });

  it("maps a high rate to good", () => {
    expect(weeklyAnswerTier(0.8)).toBe("good");
  });
});
