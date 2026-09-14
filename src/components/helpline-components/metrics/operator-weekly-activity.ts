import {
  MS_PER_DAY,
  RELIABILITY_CUTOFF_DATEINT,
  WEEKLY_ACTIVITY_WEEKS,
  WEEKLY_ANSWER_RATE_THRESHOLDS,
  normalizeOperatorName,
  parseAssignedOperators,
} from "./constants";

export interface WeeklyActivityCallRow {
  dateint: number;
  call_time: string;
  operator_name: string | null;
  assigned_operators: string | null;
}

export type WeeklyAnswerTier = "good" | "ok" | "poor" | "none";

export interface WeeklyActivity {
  /** 0 = the most recent 7-day window ending `now`, 51 = 52 weeks ago. */
  weeksAgo: number;
  /** Start of the bucket, for axis labels and tooltips. */
  weekStart: Date;
  rang: number;
  answered: number;
  answerRate: number | undefined;
  tier: WeeklyAnswerTier;
}

/** Maps a week's answer rate to a display tier. `undefined` (no opportunity) is `none`. */
export const weeklyAnswerTier = (
  answerRate: number | undefined
): WeeklyAnswerTier => {
  if (answerRate === undefined) return "none";
  if (answerRate >= WEEKLY_ANSWER_RATE_THRESHOLDS.good) return "good";
  if (answerRate >= WEEKLY_ANSWER_RATE_THRESHOLDS.ok) return "ok";
  return "poor";
};

export interface OperatorWeeklyActivityInput {
  calls: readonly WeeklyActivityCallRow[];
  operatorName: string;
  /** Evaluation instant; injectable so results are deterministic under test. */
  now?: number;
}

/**
 * Buckets one operator's opportunities and answers into trailing weekly windows, most
 * recent first internally but returned oldest-to-newest for left-to-right charting.
 *
 * Weeks are "weeks ago" from `now`, not calendar weeks — consistent with the rest of the
 * engagement metrics, which use trailing windows rather than calendar alignment, and it
 * sidesteps day-of-week bucketing entirely.
 *
 * Calls before {@link RELIABILITY_CUTOFF_DATEINT} are excluded, for the same reason as
 * every other reliability calculation: `assigned_operators` was not recorded before it, so
 * an earlier week would read as zero opportunity rather than unmeasured.
 */
export const computeOperatorWeeklyActivity = ({
  calls,
  operatorName,
  now = Date.now(),
}: OperatorWeeklyActivityInput): WeeklyActivity[] => {
  const buckets = Array.from({ length: WEEKLY_ACTIVITY_WEEKS }, () => ({
    rang: 0,
    answered: 0,
  }));

  for (const row of calls) {
    if (row.dateint < RELIABILITY_CUTOFF_DATEINT) continue;

    const at = Date.parse(row.call_time);
    if (Number.isNaN(at) || at > now) continue;

    const weeksAgo = Math.floor((now - at) / (7 * MS_PER_DAY));
    if (weeksAgo < 0 || weeksAgo >= WEEKLY_ACTIVITY_WEEKS) continue;

    const assigned = parseAssignedOperators(row.assigned_operators);
    if (!assigned.includes(operatorName)) continue;

    const bucket = buckets[weeksAgo]!;
    bucket.rang += 1;
    if (normalizeOperatorName(row.operator_name) === operatorName) {
      bucket.answered += 1;
    }
  }

  const results: WeeklyActivity[] = buckets.map((bucket, weeksAgo) => {
    const answerRate =
      bucket.rang > 0 ? bucket.answered / bucket.rang : undefined;
    return {
      weeksAgo,
      weekStart: new Date(now - (weeksAgo + 1) * 7 * MS_PER_DAY),
      rang: bucket.rang,
      answered: bucket.answered,
      answerRate,
      tier: weeklyAnswerTier(answerRate),
    };
  });

  // Oldest first, so a chart maps array order straight to left-to-right time.
  return results.reverse();
};
