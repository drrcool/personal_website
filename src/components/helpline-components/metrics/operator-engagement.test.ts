import { describe, expect, it } from "vitest";

import {
  PRIOR_WINDOW_DAYS,
  RECENT_WINDOW_DAYS,
  SILENT_MAX_DAYS_SINCE_ANSWERED,
  SILENT_MIN_OPPORTUNITIES,
} from "./constants";
import {
  computeOperatorEngagement,
  needsFollowUp,
  sortByTriage,
  type EngagementCallRow,
  type EngagementState,
} from "./operator-engagement";

const NOW = Date.parse("2026-09-11T12:00:00Z");
const MS_PER_DAY = 24 * 60 * 60 * 1000;

const daysAgo = (n: number) => new Date(NOW - n * MS_PER_DAY).toISOString();
const dateintOf = (iso: string) => Number(iso.slice(0, 10).replace(/-/g, ""));

const call = (
  assigned: string,
  answeredBy: string | null,
  agoDays: number
): EngagementCallRow => {
  const call_time = daysAgo(agoDays);
  return {
    call_time,
    dateint: dateintOf(call_time),
    operator_name: answeredBy ?? "---",
    assigned_operators: assigned,
  };
};

const repeat = <T>(n: number, make: (i: number) => T): T[] =>
  Array.from({ length: n }, (_, i) => make(i));

const run = (calls: EngagementCallRow[], scheduledNames: string[]) =>
  computeOperatorEngagement({
    calls,
    schedule: scheduledNames.map((operator_name) => ({ operator_name })),
    now: NOW,
  });

const stateOf = (
  calls: EngagementCallRow[],
  scheduled: string[],
  operator: string
): EngagementState | undefined =>
  run(calls, scheduled).find((r) => r.operator_name === operator)?.state;

describe("engagement state precedence", () => {
  it("classifies an operator with no schedule rows as unscheduled", () => {
    // They have plenty of opportunity and answer well; being off the tree still wins.
    const calls = repeat(20, () => call("A", "A", 5));
    expect(stateOf(calls, [], "A")).toBe("unscheduled");
  });

  it("prefers no_opportunity over silent when nothing ever rang them", () => {
    // Scheduled, zero opportunity. Must not be blamed as silent.
    expect(stateOf([], ["A"], "A")).toBe("no_opportunity");
  });

  it("classifies zero answers over the threshold as silent", () => {
    const calls = repeat(SILENT_MIN_OPPORTUNITIES, () => call("A", null, 5));
    expect(stateOf(calls, ["A"], "A")).toBe("silent");
  });

  it("does not call an operator silent below the opportunity threshold", () => {
    const calls = repeat(SILENT_MIN_OPPORTUNITIES - 1, () =>
      call("A", null, 5)
    );
    expect(stateOf(calls, ["A"], "A")).toBe("healthy");
  });

  it("classifies a real drop against the operator's own prior period as slipping", () => {
    const calls = [
      // Prior 90 days: answered 10 of 10.
      ...repeat(10, () => call("A", "A", RECENT_WINDOW_DAYS + 10)),
      // Last 30 days: answered 1 of 10.
      call("A", "A", 5),
      ...repeat(9, () => call("A", null, 5)),
    ];
    expect(stateOf(calls, ["A"], "A")).toBe("slipping");
  });

  it("does not call a steady operator slipping", () => {
    const calls = [
      ...repeat(10, () => call("A", "A", RECENT_WINDOW_DAYS + 10)),
      ...repeat(10, () => call("A", "A", 5)),
    ];
    expect(stateOf(calls, ["A"], "A")).toBe("healthy");
  });

  it("ignores a drop with too little evidence on either side", () => {
    const calls = [
      ...repeat(2, () => call("A", "A", RECENT_WINDOW_DAYS + 10)),
      ...repeat(2, () => call("A", null, 5)),
    ];
    expect(stateOf(calls, ["A"], "A")).toBe("healthy");
  });

  it("ignores history older than the prior window when judging slipping", () => {
    const calls = [
      ...repeat(20, () =>
        call("A", "A", RECENT_WINDOW_DAYS + PRIOR_WINDOW_DAYS + 30)
      ),
      ...repeat(10, () => call("A", null, 5)),
    ];
    // The good run predates the comparison window, so there is nothing to compare
    // against and "slipping" cannot fire.
    expect(stateOf(calls, ["A"], "A")).not.toBe("slipping");
  });

  it("catches an operator whose good history predates both windows", () => {
    // Answered well five months ago, nothing since — `silent` is windowed to the trailing
    // four months precisely so a lifetime total that is merely old cannot paper over this.
    const calls = [
      ...repeat(20, () =>
        call("A", "A", RECENT_WINDOW_DAYS + PRIOR_WINDOW_DAYS + 30)
      ),
      ...repeat(10, () => call("A", null, 5)),
    ];
    const row = run(calls, ["A"])[0];
    expect(row?.state).toBe("silent");
    expect(row?.daysSinceLastAnswered).toBeGreaterThan(
      RECENT_WINDOW_DAYS + PRIOR_WINDOW_DAYS
    );
  });

  it("does not call silent someone whose only good stretch is inside the comparison window", () => {
    // Answered recently enough to still be inside the prior window — a real, current
    // opportunity to answer, not stale lifetime history. Must not be windowed away.
    const calls = [
      ...repeat(10, () =>
        call("A", "A", RECENT_WINDOW_DAYS + PRIOR_WINDOW_DAYS - 5)
      ),
      ...repeat(10, () => call("A", null, 5)),
    ];
    expect(stateOf(calls, ["A"], "A")).not.toBe("silent");
  });

  it("catches long silence too sparse to clear the windowed volume bar", () => {
    // Reported case: rung too rarely to ever accumulate 10 opportunities inside a single
    // 120-day window, but hasn't answered in over a year despite real, ongoing opportunity.
    const calls = [
      // Answered a year ago — before both the recent and prior windows.
      call("A", "A", SILENT_MAX_DAYS_SINCE_ANSWERED + 200),
      // A trickle of unanswered opportunity since: nowhere near 10 within any 120-day
      // window, but 18 lifetime and the most recent only 52 days ago.
      ...repeat(18, (i) => call("A", null, 52 + i * 20)),
    ];
    const row = run(calls, ["A"])[0];
    expect(row?.state).toBe("silent");
    expect(row?.daysSinceLastAnswered).toBeGreaterThan(
      SILENT_MAX_DAYS_SINCE_ANSWERED
    );
  });

  it("does not flag long silence on too little lifetime evidence", () => {
    // A single missed call long ago is exactly the noise the volume floor exists to ignore
    // — one unlucky miss should not read as "gone quiet" no matter how much time passes.
    const calls = [call("A", null, SILENT_MAX_DAYS_SINCE_ANSWERED + 50)];
    expect(stateOf(calls, ["A"], "A")).not.toBe("silent");
  });

  it("does not flag long silence before the duration threshold, even with plenty of lifetime evidence", () => {
    // 10 answered opportunities, just under the duration threshold and also outside the
    // windowed check's 120-day reach. Confirms the duration path has its own boundary
    // rather than firing on lifetime volume alone.
    const calls = repeat(SILENT_MIN_OPPORTUNITIES, () =>
      call("A", "A", SILENT_MAX_DAYS_SINCE_ANSWERED - 10)
    );
    expect(stateOf(calls, ["A"], "A")).not.toBe("silent");
  });
});

describe("engagement rows", () => {
  it("lists each operator exactly once with exactly one state", () => {
    const calls = [
      ...repeat(12, () => call("A,B", "A", 5)),
      ...repeat(12, () => call("B", null, 5)),
      ...repeat(3, () => call("C", "C", 5)),
    ];
    const rows = run(calls, ["A", "B", "C", "D"]);
    const names = rows.map((r) => r.operator_name);
    expect(new Set(names).size).toBe(names.length);
    expect(new Set(names)).toEqual(new Set(["A", "B", "C", "D"]));
    for (const row of rows) expect(typeof row.state).toBe("string");
  });

  it("includes a scheduled operator who never appears in call history", () => {
    const rows = run([call("A", "A", 5)], ["A", "NEWCOMER"]);
    const newcomer = rows.find((r) => r.operator_name === "NEWCOMER");
    expect(newcomer?.state).toBe("no_opportunity");
    expect(newcomer?.rang).toBe(0);
  });

  it("reports days since last answered and last opportunity separately", () => {
    // Rang 3 days ago, but last actually answered 40 days ago.
    const calls = [call("A", "A", 40), call("A", null, 3)];
    const row = run(calls, ["A"])[0];
    expect(row?.daysSinceLastAnswered).toBe(40);
    expect(row?.daysSinceLastOpportunity).toBe(3);
  });

  it("leaves days since last answered undefined for an operator who never answered", () => {
    const row = run([call("A", null, 5)], ["A"])[0];
    expect(row?.daysSinceLastAnswered).toBeUndefined();
    expect(row?.daysSinceLastOpportunity).toBe(5);
  });

  it("exposes the opportunity count so weak silence is distinguishable from strong", () => {
    const thin = run(
      repeat(SILENT_MIN_OPPORTUNITIES, () => call("A", null, 5)),
      ["A"]
    )[0];
    const thick = run(
      repeat(89, () => call("A", null, 5)),
      ["A"]
    )[0];
    expect(thin?.state).toBe("silent");
    expect(thick?.state).toBe("silent");
    expect(thin?.rang).toBe(SILENT_MIN_OPPORTUNITIES);
    expect(thick?.rang).toBe(89);
  });

  it("reports coverage depth as other operators ringing on the same calls", () => {
    const solo = run(
      repeat(4, () => call("A", "A", 5)),
      ["A"]
    )[0];
    const deep = run(
      repeat(4, () => call("B,C,D,E", "B", 5)),
      ["B"]
    ).find((r) => r.operator_name === "B");
    expect(solo?.meanOtherOperators).toBe(0);
    expect(deep?.meanOtherOperators).toBe(3);
  });

  it("counts missed as opportunities not answered", () => {
    const calls = [
      ...repeat(3, () => call("A", "A", 5)),
      ...repeat(7, () => call("A", null, 5)),
    ];
    const row = run(calls, ["A"])[0];
    expect(row?.rang).toBe(10);
    expect(row?.answered).toBe(3);
    expect(row?.missed).toBe(7);
    expect(row?.answerRate).toBeCloseTo(0.3, 10);
  });

  it("ignores calls before the assigned-operators cutoff", () => {
    const stale: EngagementCallRow = {
      call_time: "2024-01-01T00:00:00Z",
      dateint: 20240101,
      operator_name: "---",
      assigned_operators: "A",
    };
    const rows = run([stale, call("A", "A", 5)], ["A"]);
    expect(rows[0]?.rang).toBe(1);
  });
});

describe("triage sort", () => {
  it("puts silent, unscheduled and slipping above healthy", () => {
    const calls = [
      ...repeat(12, () => call("SILENT", null, 5)),
      ...repeat(12, () => call("FINE", "FINE", 5)),
      ...repeat(12, () => call("OFFTREE", "OFFTREE", 5)),
    ];
    const sorted = sortByTriage(run(calls, ["SILENT", "FINE"]));
    const healthyIndex = sorted.findIndex((r) => r.state === "healthy");
    for (const attention of ["silent", "unscheduled", "slipping"] as const) {
      const index = sorted.findIndex((r) => r.state === attention);
      if (index >= 0) expect(index).toBeLessThan(healthyIndex);
    }
  });

  it("does not mutate its input", () => {
    const rows = run(
      repeat(3, () => call("A", "A", 5)),
      ["A"]
    );
    const before = [...rows];
    sortByTriage(rows);
    expect(rows).toEqual(before);
  });
});

describe("needsFollowUp", () => {
  it("excludes an operator no longer on the schedule", () => {
    // Off the tree — there is nothing to follow up on, whatever their old answer rate was.
    expect(needsFollowUp("unscheduled")).toBe(false);
  });

  it("includes every other state", () => {
    const attentionStates: EngagementState[] = [
      "silent",
      "slipping",
      "no_opportunity",
      "healthy",
    ];
    for (const state of attentionStates) {
      expect(needsFollowUp(state)).toBe(true);
    }
  });
});
