import {
  PRIOR_WINDOW_DAYS,
  RECENT_WINDOW_DAYS,
  RELIABILITY_CUTOFF_DATEINT,
  SILENT_MAX_DAYS_SINCE_ANSWERED,
  SILENT_MIN_OPPORTUNITIES,
  SLIPPING_MIN_OPPORTUNITIES,
  SLIPPING_RELATIVE_DROP,
  normalizeOperatorName,
  parseAssignedOperators,
} from "./constants";

/**
 * Engagement states, in the precedence order they are evaluated. Each operator gets
 * exactly one, and each maps to a different follow-up — which is why this is a set of
 * named buckets rather than a single score.
 */
export type EngagementState =
  | "unscheduled"
  | "no_opportunity"
  | "silent"
  | "slipping"
  | "healthy";

/** Triage order for the follow-up list: what needs a human first. */
export const ENGAGEMENT_STATE_ORDER: readonly EngagementState[] = [
  "silent",
  "unscheduled",
  "slipping",
  "no_opportunity",
  "healthy",
];

export const ENGAGEMENT_STATE_LABELS: Record<EngagementState, string> = {
  silent: "Gone quiet",
  unscheduled: "Not on the schedule",
  slipping: "Slipping",
  no_opportunity: "No calls yet",
  healthy: "Healthy",
};

/**
 * Whether an operator's state calls for coordinator follow-up.
 *
 * `unscheduled` is excluded: once someone is off the phone tree there is nothing to follow
 * up on — they are not failing to answer calls, they are simply no longer assigned any.
 */
export const needsFollowUp = (state: EngagementState): boolean =>
  state !== "unscheduled";

export interface EngagementCallRow {
  dateint: number;
  call_time: string;
  operator_name: string | null;
  assigned_operators: string | null;
}

export interface EngagementScheduleRow {
  operator_name: string | null;
}

export interface OperatorEngagement {
  operator_name: string;
  state: EngagementState;
  /** Calls whose `assigned_operators` included them — their opportunities. */
  rang: number;
  answered: number;
  /** Opportunities they did not answer. */
  missed: number;
  answerRate: number;
  /** Whole days since they last answered a call; `undefined` if they never have. */
  daysSinceLastAnswered?: number | undefined;
  /** Whole days since a call last rang them; `undefined` if one never has. */
  daysSinceLastOpportunity?: number | undefined;
  recentRang: number;
  recentAnswered: number;
  recentAnswerRate?: number | undefined;
  priorRang: number;
  priorAnswered: number;
  priorAnswerRate?: number | undefined;
  /** Whether they hold any `operator_schedule` rows. */
  isScheduled: boolean;
  /**
   * Mean number of *other* operators ringing on the same calls. 0 means they are typically
   * the only one on the hook, so a miss reads differently than it would at depth 4.
   */
  meanOtherOperators: number;
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

interface Accumulator {
  rang: number;
  answered: number;
  lastAnswered?: number;
  lastOpportunity?: number;
  recentRang: number;
  recentAnswered: number;
  priorRang: number;
  priorAnswered: number;
  otherOperatorsTotal: number;
}

export interface OperatorEngagementInput {
  calls: readonly EngagementCallRow[];
  schedule: readonly EngagementScheduleRow[];
  /** Evaluation instant; injectable so results are deterministic under test. */
  now?: number;
}

/**
 * Classifies each operator by engagement state.
 *
 * The distinction that matters is opportunity: an operator with no answered calls may have
 * disengaged, or may simply hold a shift nobody calls. `assigned_operators` records who was
 * ringing, so the two are separable — and `no_opportunity` is reported as its own state
 * rather than folded into a concern, because it is not the operator's fault but it does
 * mean their reliability is unmeasured.
 *
 * `silent` is windowed to the trailing four months (`recent` + `prior`), not lifetime since
 * the reliability cutoff: someone who answered well in the past and has gone quiet since
 * must still land here, and a lifetime total can never return to zero once it has been
 * positive. That windowed check also requires a minimum opportunity count inside the
 * window, to avoid reading one unlucky miss as disengagement — but an operator rung only
 * occasionally may never clear that count no matter how long they go dark. A second,
 * duration-based path catches that case: {@link SILENT_MAX_DAYS_SINCE_ANSWERED} days since
 * their last answered call, with enough lifetime opportunity for the drought to mean
 * something, overrides the windowed volume requirement.
 *
 * `slipping` compares an operator against their own prior period rather than against peers,
 * since shift difficulty varies too much for a cross-operator comparison to mean anything.
 */
export const computeOperatorEngagement = ({
  calls,
  schedule,
  now = Date.now(),
}: OperatorEngagementInput): OperatorEngagement[] => {
  const recentCutoff = now - RECENT_WINDOW_DAYS * MS_PER_DAY;
  const priorCutoff = recentCutoff - PRIOR_WINDOW_DAYS * MS_PER_DAY;

  const scheduled = new Set<string>();
  for (const row of schedule) {
    const name = normalizeOperatorName(row.operator_name);
    if (name !== undefined) scheduled.add(name);
  }

  const byOperator = new Map<string, Accumulator>();
  const accFor = (name: string): Accumulator => {
    let acc = byOperator.get(name);
    if (acc === undefined) {
      acc = {
        rang: 0,
        answered: 0,
        recentRang: 0,
        recentAnswered: 0,
        priorRang: 0,
        priorAnswered: 0,
        otherOperatorsTotal: 0,
      };
      byOperator.set(name, acc);
    }
    return acc;
  };

  for (const row of calls) {
    if (row.dateint < RELIABILITY_CUTOFF_DATEINT) continue;

    const at = Date.parse(row.call_time);
    const time = Number.isNaN(at) ? undefined : at;
    const inRecent = time !== undefined && time >= recentCutoff;
    const inPrior =
      time !== undefined && time >= priorCutoff && time < recentCutoff;

    const assigned = parseAssignedOperators(row.assigned_operators);
    const answeredBy = normalizeOperatorName(row.operator_name);

    for (const name of assigned) {
      const acc = accFor(name);
      acc.rang += 1;
      acc.otherOperatorsTotal += assigned.length - 1;
      if (time !== undefined) {
        acc.lastOpportunity = Math.max(acc.lastOpportunity ?? 0, time);
      }
      if (inRecent) acc.recentRang += 1;
      if (inPrior) acc.priorRang += 1;
    }

    if (answeredBy !== undefined) {
      const acc = accFor(answeredBy);
      acc.answered += 1;
      if (time !== undefined) {
        acc.lastAnswered = Math.max(acc.lastAnswered ?? 0, time);
      }
      if (inRecent) acc.recentAnswered += 1;
      if (inPrior) acc.priorAnswered += 1;
    }
  }

  // Operators on the schedule who never appear in call history still belong in the list —
  // their absence is exactly what `no_opportunity` is for.
  for (const name of scheduled) accFor(name);

  const wholeDaysSince = (time?: number): number | undefined =>
    time === undefined ? undefined : Math.floor((now - time) / MS_PER_DAY);

  const rateOf = (answered: number, rang: number): number | undefined =>
    rang > 0 ? Math.min(1, answered / rang) : undefined;

  const results: OperatorEngagement[] = [];
  for (const [operator_name, acc] of byOperator) {
    const recentAnswerRate = rateOf(acc.recentAnswered, acc.recentRang);
    const priorAnswerRate = rateOf(acc.priorAnswered, acc.priorRang);

    const isScheduled = scheduled.has(operator_name);

    // Enough evidence on both sides of the comparison before calling a drop real.
    const comparable =
      acc.recentRang >= SLIPPING_MIN_OPPORTUNITIES &&
      acc.priorRang >= SLIPPING_MIN_OPPORTUNITIES &&
      recentAnswerRate !== undefined &&
      priorAnswerRate !== undefined &&
      priorAnswerRate > 0;
    const isSlipping =
      comparable &&
      recentAnswerRate <= priorAnswerRate * (1 - SLIPPING_RELATIVE_DROP);

    // Windowed rather than lifetime-since-cutoff: an operator who answered well back in
    // June and has answered nothing for the last few months must still read as silent.
    // Lifetime `acc.answered` would stay positive forever once someone has ever picked up,
    // masking exactly the "stopped taking calls" case this bucket exists to catch. The
    // window is `recent` + `prior` (30 + 90 days) rather than a new constant, so "gone
    // quiet" means quiet for the last four months, not quiet for the last 30 days on a
    // single bad month.
    const windowedRang = acc.recentRang + acc.priorRang;
    const windowedAnswered = acc.recentAnswered + acc.priorAnswered;
    const isSilentByVolume =
      windowedAnswered === 0 && windowedRang >= SILENT_MIN_OPPORTUNITIES;

    // Catches an operator rung too rarely to ever clear the windowed volume bar: a real
    // year of silence with only occasional opportunity would otherwise never accumulate 10
    // opportunities inside a single 120-day window and would fall through to `healthy`.
    // Reuses `SILENT_MIN_OPPORTUNITIES` — the same calibrated evidence floor as the
    // windowed check, just measured over their whole recorded history instead of a single
    // 120-day slice, so a long drought means something rather than being one unlucky miss.
    const daysSinceLastAnswered = wholeDaysSince(acc.lastAnswered);
    const isSilentByDuration =
      acc.rang >= SILENT_MIN_OPPORTUNITIES &&
      (daysSinceLastAnswered === undefined ||
        daysSinceLastAnswered >= SILENT_MAX_DAYS_SINCE_ANSWERED);

    const isSilent = isSilentByVolume || isSilentByDuration;

    let state: EngagementState;
    if (!isScheduled) {
      state = "unscheduled";
    } else if (acc.rang === 0) {
      state = "no_opportunity";
    } else if (isSilent) {
      state = "silent";
    } else if (isSlipping) {
      state = "slipping";
    } else {
      state = "healthy";
    }

    results.push({
      operator_name,
      state,
      rang: acc.rang,
      answered: acc.answered,
      missed: Math.max(0, acc.rang - acc.answered),
      answerRate: rateOf(acc.answered, acc.rang) ?? 0,
      daysSinceLastAnswered,
      daysSinceLastOpportunity: wholeDaysSince(acc.lastOpportunity),
      recentRang: acc.recentRang,
      recentAnswered: acc.recentAnswered,
      recentAnswerRate,
      priorRang: acc.priorRang,
      priorAnswered: acc.priorAnswered,
      priorAnswerRate,
      isScheduled,
      meanOtherOperators: acc.rang > 0 ? acc.otherOperatorsTotal / acc.rang : 0,
    });
  }

  return results;
};

/** Sorts the follow-up list: states needing attention first, then by weakest evidence. */
export const sortByTriage = (
  rows: readonly OperatorEngagement[]
): OperatorEngagement[] =>
  [...rows].sort((a, b) => {
    const byState =
      ENGAGEMENT_STATE_ORDER.indexOf(a.state) -
      ENGAGEMENT_STATE_ORDER.indexOf(b.state);
    if (byState !== 0) return byState;
    return (
      (b.daysSinceLastAnswered ?? Number.MAX_SAFE_INTEGER) -
      (a.daysSinceLastAnswered ?? Number.MAX_SAFE_INTEGER)
    );
  });
