/**
 * Shared constants for the derived helpline metrics.
 *
 * These live apart from the functions that use them so they can be calibrated without
 * touching the computation, and so the UI can label tiers from the same source.
 */

/**
 * `assigned_operators` was not populated before this date, so any per-operator rate
 * computed over earlier calls counts opportunities that were never recorded and
 * understates reliability. Every reliability calculation clamps to this floor regardless
 * of the window the dashboard asks for.
 */
export const RELIABILITY_CUTOFF_DATEINT = 20250501;

/** Human-readable form of {@link RELIABILITY_CUTOFF_DATEINT}, for disclosing the window. */
export const RELIABILITY_CUTOFF_LABEL = "2025-05-01";

/**
 * Shrinkage strength for per-cell observed missed rates. A cell's rate is pulled toward
 * the helpline's global rate as though it had `k` extra calls at that global rate, so a
 * 1-of-1 miss no longer reads as total failure.
 *
 * Confirmed at 5 against real data (task 2.6): GSC's median hour sees 4 calls per 90 days,
 * giving `w = 0.44`, so the blend sits near half observation and half structure at the
 * median — leaning on evidence where it exists without letting three calls dictate a tier.
 */
export const SHRINKAGE_K = 5;

/**
 * Shrinkage strength for per-operator answer rates, applied for the same reason as
 * {@link SHRINKAGE_K}: an operator with one opportunity and one answer is not 100%
 * reliable, and feeding a raw 1.0 into `p_struct` would zero out the whole cell.
 */
export const OPERATOR_SHRINKAGE_K = 3;

/**
 * Minimum opportunities before zero answers is treated as `silent` rather than noise.
 * Calibrated in `rls-audit.md` § 1.5: sits in the natural gap in the observed opportunity
 * distribution, and corresponds to a 4.5% per-operator false-positive rate against the
 * observed global answer rate of 0.2665.
 */
export const SILENT_MIN_OPPORTUNITIES = 10;

/** Relative drop in answer rate, recent vs. prior, that counts as `slipping`. */
export const SLIPPING_RELATIVE_DROP = 0.4;

/** Minimum opportunities in each period before a `slipping` comparison is meaningful. */
export const SLIPPING_MIN_OPPORTUNITIES = 5;

/**
 * Days since an operator last answered a call before long-term silence overrides the
 * windowed-volume requirement on `silent`.
 *
 * The windowed check requires {@link SILENT_MIN_OPPORTUNITIES} opportunities inside the
 * trailing 120 days, which an operator rung only occasionally may never reach even after a
 * full year of answering nothing. Longer than the 120-day window so it only fires where the
 * windowed check plausibly could not; an initial guess pending calibration against real
 * per-operator call-frequency data.
 */
export const SILENT_MAX_DAYS_SINCE_ANSWERED = 150;

export const RECENT_WINDOW_DAYS = 30;
export const PRIOR_WINDOW_DAYS = 90;

/** Milliseconds in a day, shared by every windowed calculation. */
export const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** How many trailing weeks the per-operator weekly activity chart covers. */
export const WEEKLY_ACTIVITY_WEEKS = 52;

/**
 * Per-week answer-rate tiers for coloring the weekly activity chart. Deliberately
 * categorical rather than a continuous gradient, matching the tiering already used for
 * `need_score` and the missed-call-rate grid rather than introducing a new visual language.
 */
export const WEEKLY_ANSWER_RATE_THRESHOLDS = {
  good: 0.5,
  ok: 0.25,
} as const;

export type NeedTier = "critical" | "warning" | "ok" | "none";

/**
 * Absolute `need_score` cutoffs, in expected missed callers per week. Absolute rather than
 * percentile-based so a tier means the same thing week to week and the worst hour stays
 * visible, rather than shifting when unrelated cells change.
 *
 * Calibrated against the real 90-day distribution (task 2.6). For GSC — 158 scored hours,
 * 30.7 expected missed callers per week — these cutoffs yield 11 critical, 19 warning,
 * 119 ok, 9 none: a triage list a coordinator can act on.
 *
 * The initial proposal of 0.5 / 0.15 was rejected by the data: GSC's *median* hour scores
 * 0.167, so a 0.15 warning line would have painted over half the grid amber.
 *
 * NORCAL scores `none` or `ok` in every hour at any plausible cutoff — it loses 0.61
 * callers per week in total. That is a correct reading of a genuinely low-volume helpline,
 * not a calibration failure, but it does mean tier color carries little signal there.
 */
export const NEED_TIER_CUTOFFS = {
  critical: 0.45,
  warning: 0.3,
  ok: 0,
} as const;

/** Severity order, most severe first — for sorting and for tier comparisons. */
export const NEED_TIER_SEVERITY: readonly NeedTier[] = [
  "critical",
  "warning",
  "ok",
  "none",
];

/** Placeholder strings the scraper writes when no operator applies. */
const OPERATOR_PLACEHOLDERS = new Set(["--", "---", ""]);

/**
 * Normalizes an operator name from `operator_name` or a member of `assigned_operators`,
 * returning `undefined` for the scraper's placeholders. Trimming matches the existing
 * behavior in `useOperatorStats.ts` so the two agree on operator identity.
 */
export const normalizeOperatorName = (
  raw: string | null | undefined
): string | undefined => {
  if (raw == null) return undefined;
  const trimmed = raw.trim();
  return OPERATOR_PLACEHOLDERS.has(trimmed) ? undefined : trimmed;
};

/** Splits an `assigned_operators` cell into its normalized operator names. */
export const parseAssignedOperators = (
  raw: string | null | undefined
): string[] => {
  if (raw == null) return [];
  const seen = new Set<string>();
  for (const part of raw.split(",")) {
    const name = normalizeOperatorName(part);
    if (name !== undefined) seen.add(name);
  }
  return [...seen];
};

/** Maps a `need_score` to its tier. */
export const needTierFor = (needScore: number): NeedTier => {
  if (needScore > NEED_TIER_CUTOFFS.critical) return "critical";
  if (needScore > NEED_TIER_CUTOFFS.warning) return "warning";
  if (needScore > NEED_TIER_CUTOFFS.ok) return "ok";
  return "none";
};

/**
 * Maximum gap between consecutive calls from the same number for them to count as one
 * retry burst. Chosen to capture "I called back right away" without merging a caller's
 * separate visits to the helpline days apart.
 */
export const RETRY_BURST_GAP_MINUTES = 30;

/**
 * A burst never spans a day boundary regardless of the gap, so a call at 23:55 and one at
 * 00:10 are two separate approaches rather than one.
 */
export const RETRY_BURST_SPANS_DAYS = false;

/**
 * Grace period before an unanswered call counts as a lost caller. Below this, the caller
 * may simply not have gotten around to calling back yet, and counting them would overstate
 * the loss.
 */
export const LOST_CALLER_GRACE_DAYS = 7;

/** The scraper's placeholder for an unrecorded caller number. */
export const CALLER_NUMBER_PLACEHOLDER = "--";
