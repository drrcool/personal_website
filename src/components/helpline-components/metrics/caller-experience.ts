import {
  CALLER_NUMBER_PLACEHOLDER,
  LOST_CALLER_GRACE_DAYS,
  RETRY_BURST_GAP_MINUTES,
} from "./constants";

/**
 * The `cleaned_calls` columns the caller-centered metrics need.
 *
 * `caller_number` arrives SHA-256 hashed but stable, which is all these metrics require:
 * repeat callers can be grouped without any real phone number reaching the client.
 */
export interface CallerCallRow {
  caller_number: string | null;
  call_time: string;
  is_missed_call: number;
}

export interface RetryBurst {
  attempts: number;
  connected: boolean;
}

export interface CallerExperience {
  /** Distinct callers with at least one usable call in the window. */
  totalCallers: number;
  /** Callers who needed more than one attempt in a burst before connecting. */
  callersNeedingRetry: number;
  /** Retry attempts across those callers, beyond the first of each burst. */
  extraAttempts: number;
  /** Attempts-required distribution, keyed by attempt count. */
  attemptsDistribution: Map<number, number>;
  /** Callers whose call went unanswered, who never called back, past the grace period. */
  lostCallers: number;
  /** Callers excluded from {@link lostCallers} because their miss is still recent. */
  tooRecentToJudge: number;
  /** Attempts a lost caller made before giving up, keyed by attempt count. */
  lostAttemptsDistribution: Map<number, number>;
}

const MS_PER_MINUTE = 60 * 1000;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

interface ParsedCall {
  time: number;
  missed: boolean;
  dayKey: string;
}

/** Groups a caller's chronological calls into bursts, never spanning a day boundary. */
const burstsOf = (calls: readonly ParsedCall[]): RetryBurst[] => {
  const bursts: RetryBurst[] = [];
  let attempts = 0;
  let connected = false;
  let previous: ParsedCall | undefined;

  const flush = () => {
    if (attempts > 0) bursts.push({ attempts, connected });
    attempts = 0;
    connected = false;
  };

  for (const call of calls) {
    const continues =
      previous !== undefined &&
      call.dayKey === previous.dayKey &&
      call.time - previous.time <= RETRY_BURST_GAP_MINUTES * MS_PER_MINUTE;
    if (!continues) flush();
    attempts += 1;
    if (!call.missed) connected = true;
    previous = call;
  }
  flush();
  return bursts;
};

export interface CallerExperienceInput {
  calls: readonly CallerCallRow[];
  /** Evaluation instant; injectable so results are deterministic under test. */
  now?: number;
}

/**
 * Derives caller-centered metrics from repeat-caller behavior.
 *
 * Freedom Voice records no time-to-answer, so caller impact has to be inferred from what
 * callers did: **retry burden** counts those who had to try more than once in a sitting
 * before reaching someone, and **lost callers** counts those whose call went unanswered and
 * who never came back. The second shares its unit with the need score — callers lost — which
 * is what lets the two be presented as a single argument for recruiting.
 */
export const computeCallerExperience = ({
  calls,
  now = Date.now(),
}: CallerExperienceInput): CallerExperience => {
  const byCaller = new Map<string, ParsedCall[]>();

  for (const row of calls) {
    const caller = row.caller_number?.trim();
    // Unrecorded numbers cannot be grouped, and all share one placeholder, so including
    // them would collapse thousands of unrelated callers into a single fake caller.
    if (
      caller === undefined ||
      caller === "" ||
      caller === CALLER_NUMBER_PLACEHOLDER
    ) {
      continue;
    }
    const time = Date.parse(row.call_time);
    if (Number.isNaN(time)) continue;

    const existing = byCaller.get(caller);
    const parsed: ParsedCall = {
      time,
      missed: row.is_missed_call > 0,
      dayKey: new Date(time).toISOString().slice(0, 10),
    };
    if (existing === undefined) byCaller.set(caller, [parsed]);
    else existing.push(parsed);
  }

  let callersNeedingRetry = 0;
  let extraAttempts = 0;
  let lostCallers = 0;
  let tooRecentToJudge = 0;
  const attemptsDistribution = new Map<number, number>();
  const lostAttemptsDistribution = new Map<number, number>();

  for (const unsorted of byCaller.values()) {
    const ordered = [...unsorted].sort((a, b) => a.time - b.time);

    const bursts = burstsOf(ordered);
    const retryBursts = bursts.filter(
      (burst) => burst.connected && burst.attempts > 1
    );
    if (retryBursts.length > 0) {
      callersNeedingRetry += 1;
      for (const burst of retryBursts) {
        extraAttempts += burst.attempts - 1;
        attemptsDistribution.set(
          burst.attempts,
          (attemptsDistribution.get(burst.attempts) ?? 0) + 1
        );
      }
    }

    // Lost: never connected at all, and their last attempt is old enough that a callback
    // would already have happened.
    const everConnected = ordered.some((call) => !call.missed);
    if (!everConnected) {
      const last = ordered[ordered.length - 1];
      if (last !== undefined) {
        const daysSince = (now - last.time) / MS_PER_DAY;
        if (daysSince >= LOST_CALLER_GRACE_DAYS) {
          lostCallers += 1;
          lostAttemptsDistribution.set(
            ordered.length,
            (lostAttemptsDistribution.get(ordered.length) ?? 0) + 1
          );
        } else {
          tooRecentToJudge += 1;
        }
      }
    }
  }

  return {
    totalCallers: byCaller.size,
    callersNeedingRetry,
    extraAttempts,
    attemptsDistribution,
    lostCallers,
    tooRecentToJudge,
    lostAttemptsDistribution,
  };
};
