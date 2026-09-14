import { describe, expect, it } from "vitest";

import {
  NEED_TIER_CUTOFFS,
  SHRINKAGE_K,
  needTierFor,
  parseAssignedOperators,
} from "./constants";
import {
  computeHourlyNeed,
  type HourlyCallAggregate,
  type ScheduleCellRow,
} from "./hourly-need";
import {
  computeOperatorReliability,
  type ReliabilityCallRow,
} from "./operator-reliability";

const answered = (op: string, assigned = op, dateint = 20250601) =>
  ({ dateint, operator_name: op, assigned_operators: assigned }) as const;
const missed = (assigned: string, dateint = 20250601) =>
  ({ dateint, operator_name: "---", assigned_operators: assigned }) as const;
const repeat = <T>(n: number, make: () => T): T[] =>
  Array.from({ length: n }, make);

/**
 * A answers 19 of 20; B, C and D each answer 3 of 10 — the "three operators answering
 * 30%" of the coverage-need-score spec. Plus 500 pre-cutoff rows that must be ignored.
 */
const FIXTURE: ReliabilityCallRow[] = [
  ...repeat(19, () => answered("A")),
  missed("A"),
  ...["B", "C", "D"].flatMap((op) => [
    ...repeat(3, () => answered(op)),
    ...repeat(7, () => missed(op)),
  ]),
  ...repeat(500, () => missed("A", 20240101)),
];

const reliability = computeOperatorReliability(FIXTURE);

const need = (
  schedule: ScheduleCellRow[],
  calls: HourlyCallAggregate[],
  weeksInWindow = 10
) => computeHourlyNeed({ schedule, calls, weeksInWindow, reliability });

const cell = (
  day_of_week: number,
  hour_of_day: number,
  assigned_operators: string,
  operators_scheduled = assigned_operators === "--"
    ? 0
    : assigned_operators.split(",").length
): ScheduleCellRow => ({
  day_of_week,
  hour_of_day,
  operators_scheduled,
  assigned_operators,
});

const volume = (
  day_of_week: number,
  hour_of_day: number,
  call_cnt: number,
  missed_call_cnt: number
): HourlyCallAggregate => ({
  day_of_week,
  hour_of_day,
  call_cnt,
  missed_call_cnt,
});

describe("parseAssignedOperators", () => {
  it("trims names, matching useOperatorStats.ts", () => {
    expect(parseAssignedOperators(" A , B ")).toEqual(["A", "B"]);
  });

  it("drops the scraper's placeholders", () => {
    expect(parseAssignedOperators("--")).toEqual([]);
    expect(parseAssignedOperators("A,---,B")).toEqual(["A", "B"]);
  });

  it("deduplicates a repeated operator", () => {
    expect(parseAssignedOperators("A,A")).toEqual(["A"]);
  });

  it("treats null as no operators", () => {
    expect(parseAssignedOperators(null)).toEqual([]);
  });
});

describe("operator reliability", () => {
  it("ignores calls before the assigned-operators cutoff", () => {
    // 520 rows mention A, but only 20 are on or after 2025-05-01.
    expect(reliability.byOperator.get("A")?.rang).toBe(20);
  });

  it("clamps regardless of the window the dashboard asks for", () => {
    const preCutoffOnly = computeOperatorReliability(
      repeat(50, () => missed("Z", 20240101))
    );
    expect(preCutoffOnly.byOperator.size).toBe(0);
  });

  it("separates a reliable operator from an unreliable one", () => {
    const a = reliability.byOperator.get("A")?.answerRate ?? 0;
    const b = reliability.byOperator.get("B")?.answerRate ?? 0;
    expect(a).toBeGreaterThan(0.75);
    expect(b).toBeLessThan(0.45);
    expect(a).toBeGreaterThan(b);
  });

  it("reports the raw rate alongside the shrunk one", () => {
    expect(reliability.byOperator.get("B")?.rawAnswerRate).toBeCloseTo(0.3, 10);
  });

  it("falls back to the global rate for an operator with no opportunity", () => {
    const rate = reliability.answerRateFor("NEVER_SEEN");
    expect(rate).toBe(reliability.globalAnswerRate);
    expect(Number.isFinite(rate)).toBe(true);
  });

  it("never exceeds 1 when an operator answered a call that did not list them", () => {
    const odd = computeOperatorReliability([
      answered("A", "B"),
      answered("A", "B"),
    ]);
    expect(odd.byOperator.get("A")?.rawAnswerRate).toBeLessThanOrEqual(1);
    expect(odd.byOperator.get("A")?.answerRate).toBeLessThanOrEqual(1);
  });

  it("shrinks a single lucky answer away from a perfect rate", () => {
    const lucky = computeOperatorReliability([answered("A"), missed("B")]);
    expect(lucky.byOperator.get("A")?.rawAnswerRate).toBe(1);
    expect(lucky.byOperator.get("A")?.answerRate).toBeLessThan(1);
  });
});

describe("structural failure probability", () => {
  it("is 1 for an unstaffed hour", () => {
    const result = need([cell(2, 3, "--")], [volume(2, 3, 5, 2)]);
    expect(result.byCell.get("2-3")?.p_struct).toBe(1);
  });

  it("is 1 for an hour that received calls but has no schedule row", () => {
    const result = need([], [volume(6, 6, 8, 4)]);
    expect(result.byCell.get("6-6")?.p_struct).toBe(1);
  });

  it("never increases when another operator is added", () => {
    const one = need([cell(5, 5, "B")], []).byCell.get("5-5")?.p_struct ?? 0;
    const two = need([cell(5, 5, "B,A")], []).byCell.get("5-5")?.p_struct ?? 0;
    expect(two).toBeLessThanOrEqual(one);
  });

  it("is defined when an assigned operator has no reliability data", () => {
    const p = need([cell(1, 1, "UNKNOWN")], []).byCell.get("1-1")?.p_struct;
    expect(p).toBeDefined();
    expect(Number.isFinite(p)).toBe(true);
  });

  it("makes three unreliable operators worse than one reliable one", () => {
    const result = need(
      [cell(0, 0, "B,C,D"), cell(0, 1, "A")],
      [volume(0, 0, 40, 0), volume(0, 1, 40, 0)]
    );
    expect(result.byCell.get("0-0")?.p_struct).toBeGreaterThan(
      result.byCell.get("0-1")?.p_struct ?? 1
    );
  });
});

describe("observed missed rate", () => {
  it("does not read a 1-of-1 miss as total failure", () => {
    // Global missed rate across the two cells is 22/71 ≈ 0.31.
    const result = need(
      [cell(0, 0, "A")],
      [volume(0, 0, 1, 1), volume(0, 1, 70, 21)]
    );
    expect(result.byCell.get("0-0")?.p_obs).toBeLessThan(0.5);
  });

  it("reflects an hour's own rate once it has volume", () => {
    const result = need([cell(3, 9, "A")], [volume(3, 9, 40, 20)]);
    expect(result.byCell.get("3-9")?.p_obs).toBeCloseTo(0.5, 1);
    expect(Math.abs((result.byCell.get("3-9")?.p_obs ?? 0) - 0.5)).toBeLessThan(
      0.05
    );
  });
});

describe("evidence-weighted blend", () => {
  it("relies entirely on structure when there are no calls", () => {
    const c = need([cell(1, 4, "A")], []).byCell.get("1-4");
    expect(c?.p_missed).toBeCloseTo(c?.p_struct ?? -1, 12);
    expect(c?.w).toBe(0);
  });

  it("leans at least 0.95 on observation at 100 calls", () => {
    const result = need([cell(4, 4, "A")], [volume(4, 4, 100, 10)]);
    expect(result.byCell.get("4-4")?.w).toBeGreaterThanOrEqual(0.95);
  });

  it("sits near half and half at the calibration median of 4 calls", () => {
    const result = need([cell(4, 5, "A")], [volume(4, 5, 4, 1)]);
    expect(result.byCell.get("4-5")?.w).toBeCloseTo(4 / (4 + SHRINKAGE_K), 10);
  });
});

describe("need score", () => {
  it("is zero for an hour with no calls, and tiers as none", () => {
    const c = need([cell(1, 4, "A")], []).byCell.get("1-4");
    expect(c?.need_score).toBe(0);
    expect(c?.need_tier).toBe("none");
  });

  it("scores demand with unreliable coverage above demand with reliable coverage", () => {
    // Both hours: 40 calls over 10 weeks. Only the coverage differs.
    const result = need(
      [cell(0, 0, "B,C,D"), cell(0, 1, "A")],
      [volume(0, 0, 40, 12), volume(0, 1, 40, 2)]
    );
    expect(result.byCell.get("0-0")?.need_score).toBeGreaterThan(
      result.byCell.get("0-1")?.need_score ?? Infinity
    );
  });

  it("expresses calls per week over the window", () => {
    const result = need([cell(2, 2, "A")], [volume(2, 2, 40, 0)], 10);
    expect(result.byCell.get("2-2")?.calls_per_week).toBe(4);
  });

  it("treats a non-positive window as one week rather than dividing by zero", () => {
    const result = need([cell(2, 2, "A")], [volume(2, 2, 7, 0)], 0);
    expect(result.byCell.get("2-2")?.calls_per_week).toBe(7);
  });

  it("totals the grid into expected missed callers per week", () => {
    const result = need(
      [cell(0, 0, "--"), cell(0, 1, "--")],
      [volume(0, 0, 10, 10), volume(0, 1, 10, 10)],
      10
    );
    const summed = [...result.byCell.values()].reduce(
      (total, c) => total + c.need_score,
      0
    );
    expect(result.totalNeedScore).toBeCloseTo(summed, 12);
  });

  it("keys each hour uniquely", () => {
    const result = need(
      [cell(0, 0, "A"), cell(0, 1, "A"), cell(1, 0, "A")],
      []
    );
    expect(result.byCell.size).toBe(3);
  });

  it("reports staffing when the count and the name list disagree", () => {
    const result = need([cell(3, 3, "A,B", 0)], []);
    expect(result.byCell.get("3-3")?.operators_scheduled).toBe(2);
  });
});

describe("need tiers", () => {
  it("orders by severity", () => {
    expect(needTierFor(0.8)).toBe("critical");
    expect(needTierFor(0.35)).toBe("warning");
    expect(needTierFor(0.05)).toBe("ok");
  });

  it("maps exactly zero to none", () => {
    expect(needTierFor(0)).toBe("none");
  });

  it("puts the calibrated cutoffs on the more severe side", () => {
    expect(needTierFor(NEED_TIER_CUTOFFS.critical + 1e-9)).toBe("critical");
    expect(needTierFor(NEED_TIER_CUTOFFS.critical)).toBe("warning");
    expect(needTierFor(NEED_TIER_CUTOFFS.warning + 1e-9)).toBe("warning");
    expect(needTierFor(NEED_TIER_CUTOFFS.warning)).toBe("ok");
  });
});
