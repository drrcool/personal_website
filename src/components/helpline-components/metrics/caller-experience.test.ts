import { describe, expect, it } from "vitest";

import {
  computeCallerExperience,
  type CallerCallRow,
} from "./caller-experience";
import {
  CALLER_NUMBER_PLACEHOLDER,
  LOST_CALLER_GRACE_DAYS,
  RETRY_BURST_GAP_MINUTES,
} from "./constants";

const NOW = Date.parse("2026-09-11T12:00:00Z");
const MS_PER_MINUTE = 60 * 1000;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** A call from `caller`, `agoDays` days plus `plusMinutes` minutes before NOW. */
const call = (
  caller: string,
  agoDays: number,
  plusMinutes = 0,
  missed = true
): CallerCallRow => ({
  caller_number: caller,
  call_time: new Date(
    NOW - agoDays * MS_PER_DAY + plusMinutes * MS_PER_MINUTE
  ).toISOString(),
  is_missed_call: missed ? 1 : 0,
});

const run = (calls: CallerCallRow[]) =>
  computeCallerExperience({ calls, now: NOW });

const OLD = LOST_CALLER_GRACE_DAYS + 30;

describe("retry burden", () => {
  it("counts a caller who tried three times in twenty minutes before connecting", () => {
    const result = run([
      call("c1", OLD, 0),
      call("c1", OLD, 10),
      call("c1", OLD, 20, false),
    ]);
    expect(result.callersNeedingRetry).toBe(1);
    expect(result.extraAttempts).toBe(2);
    expect(result.attemptsDistribution.get(3)).toBe(1);
  });

  it("does not count a caller who connected on the first attempt", () => {
    const result = run([call("c1", OLD, 0, false)]);
    expect(result.callersNeedingRetry).toBe(0);
    expect(result.extraAttempts).toBe(0);
  });

  it("does not group calls a week apart into one burst", () => {
    const result = run([call("c1", OLD + 7, 0), call("c1", OLD, 0, false)]);
    // Two separate bursts, the second a first-attempt connection.
    expect(result.callersNeedingRetry).toBe(0);
  });

  it("does not group calls separated by more than the burst gap", () => {
    const result = run([
      call("c1", OLD, 0),
      call("c1", OLD, RETRY_BURST_GAP_MINUTES + 5, false),
    ]);
    expect(result.callersNeedingRetry).toBe(0);
  });

  it("groups calls exactly at the burst gap boundary", () => {
    const result = run([
      call("c1", OLD, 0),
      call("c1", OLD, RETRY_BURST_GAP_MINUTES, false),
    ]);
    expect(result.callersNeedingRetry).toBe(1);
    expect(result.attemptsDistribution.get(2)).toBe(1);
  });

  it("never spans a day boundary even within the gap", () => {
    const justBefore: CallerCallRow = {
      caller_number: "c1",
      call_time: "2026-08-01T23:55:00Z",
      is_missed_call: 1,
    };
    const justAfter: CallerCallRow = {
      caller_number: "c1",
      call_time: "2026-08-02T00:05:00Z",
      is_missed_call: 0,
    };
    const result = run([justBefore, justAfter]);
    expect(result.callersNeedingRetry).toBe(0);
  });

  it("counts a caller once even across several retry bursts", () => {
    const result = run([
      call("c1", OLD + 20, 0),
      call("c1", OLD + 20, 5, false),
      call("c1", OLD, 0),
      call("c1", OLD, 5, false),
    ]);
    expect(result.callersNeedingRetry).toBe(1);
    expect(result.extraAttempts).toBe(2);
  });

  it("does not count a burst the caller abandoned without connecting", () => {
    const result = run([call("c1", OLD, 0), call("c1", OLD, 5)]);
    expect(result.callersNeedingRetry).toBe(0);
  });

  it("orders calls that arrive out of sequence", () => {
    const result = run([
      call("c1", OLD, 20, false),
      call("c1", OLD, 0),
      call("c1", OLD, 10),
    ]);
    expect(result.callersNeedingRetry).toBe(1);
    expect(result.attemptsDistribution.get(3)).toBe(1);
  });
});

describe("lost callers", () => {
  it("counts a caller whose only call went unanswered and who never returned", () => {
    expect(run([call("c1", OLD)]).lostCallers).toBe(1);
  });

  it("does not count a caller who was missed but later connected", () => {
    const result = run([call("c1", OLD + 5), call("c1", OLD, 0, false)]);
    expect(result.lostCallers).toBe(0);
  });

  it("does not count a recent miss as lost", () => {
    const result = run([call("c1", 1)]);
    expect(result.lostCallers).toBe(0);
    expect(result.tooRecentToJudge).toBe(1);
  });

  it("counts a miss exactly at the grace boundary", () => {
    expect(run([call("c1", LOST_CALLER_GRACE_DAYS)]).lostCallers).toBe(1);
  });

  it("judges by the caller's most recent attempt, not their first", () => {
    // First attempt is old, but they tried again yesterday — too recent to call lost.
    const result = run([call("c1", OLD), call("c1", 1)]);
    expect(result.lostCallers).toBe(0);
    expect(result.tooRecentToJudge).toBe(1);
  });

  it("buckets a lost caller by how many attempts they made before giving up", () => {
    const result = run([call("c1", OLD, 0), call("c1", OLD, 10)]);
    expect(result.lostCallers).toBe(1);
    expect(result.lostAttemptsDistribution.get(2)).toBe(1);
  });

  it("does not bucket a caller who is still too recent to judge", () => {
    const result = run([call("c1", 1, 0), call("c1", 1, 10)]);
    expect(result.lostAttemptsDistribution.size).toBe(0);
  });

  it("does not bucket a caller who eventually connected", () => {
    const result = run([call("c1", OLD, 0), call("c1", OLD, 10, false)]);
    expect(result.lostAttemptsDistribution.size).toBe(0);
  });
});

describe("caller identity handling", () => {
  it("excludes the unrecorded-number placeholder", () => {
    // All placeholder rows share one value; grouping them would invent a single
    // super-caller out of thousands of unrelated ones.
    const result = run([
      call(CALLER_NUMBER_PLACEHOLDER, OLD),
      call(CALLER_NUMBER_PLACEHOLDER, OLD, 5),
      call("c1", OLD),
    ]);
    expect(result.totalCallers).toBe(1);
    expect(result.lostCallers).toBe(1);
  });

  it("ignores rows with an unparseable call time", () => {
    const bad: CallerCallRow = {
      caller_number: "c1",
      call_time: "not a date",
      is_missed_call: 1,
    };
    expect(run([bad]).totalCallers).toBe(0);
  });

  it("treats a null caller number as unusable", () => {
    const nullCaller: CallerCallRow = {
      caller_number: null,
      call_time: new Date(NOW).toISOString(),
      is_missed_call: 1,
    };
    expect(run([nullCaller]).totalCallers).toBe(0);
  });

  it("counts distinct callers", () => {
    const result = run([call("c1", OLD), call("c2", OLD), call("c1", OLD, 5)]);
    expect(result.totalCallers).toBe(2);
  });

  it("works on hashed identifiers, needing no real phone number", () => {
    const hashed = "a".repeat(64);
    const result = run([call(hashed, OLD), call(hashed, OLD, 5, false)]);
    expect(result.totalCallers).toBe(1);
    expect(result.callersNeedingRetry).toBe(1);
  });
});
