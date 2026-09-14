import {
  OPERATOR_SHRINKAGE_K,
  RELIABILITY_CUTOFF_DATEINT,
  normalizeOperatorName,
  parseAssignedOperators,
} from "./constants";

/** The `cleaned_calls` columns reliability needs. */
export interface ReliabilityCallRow {
  dateint: number;
  operator_name: string | null;
  assigned_operators: string | null;
}

export interface OperatorReliability {
  operator_name: string;
  /** Calls whose `assigned_operators` included this operator — their opportunities. */
  rang: number;
  /** Calls this operator answered. */
  answered: number;
  /** `answered / rang`, unshrunk. `0` when `rang` is 0. */
  rawAnswerRate: number;
  /**
   * `answered / rang` shrunk toward the global rate by {@link OPERATOR_SHRINKAGE_K}.
   * This is the rate `p_struct` should consume.
   */
  answerRate: number;
}

export interface ReliabilityTable {
  /** Per-operator reliability, keyed by normalized operator name. */
  byOperator: Map<string, OperatorReliability>;
  /** Answered / opportunities across every operator — the prior for unknown operators. */
  globalAnswerRate: number;
  totalOpportunities: number;
  totalAnswered: number;
  /**
   * Answer rate for an operator, falling back to {@link globalAnswerRate} for an operator
   * with no recorded opportunity. Never returns `NaN` or `undefined`, so `p_struct` is
   * always defined.
   */
  answerRateFor: (operatorName: string) => number;
}

/**
 * Computes per-operator answer rates from call history.
 *
 * Opportunity comes from `assigned_operators` (who was ringing) and outcome from
 * `operator_name` (who picked up); together they distinguish an operator who is not
 * answering from one whose shift is simply quiet.
 *
 * Rows before {@link RELIABILITY_CUTOFF_DATEINT} are dropped unconditionally, whatever
 * window the caller passes, because `assigned_operators` was empty before then.
 */
export const computeOperatorReliability = (
  rows: readonly ReliabilityCallRow[]
): ReliabilityTable => {
  const byOperator = new Map<string, OperatorReliability>();

  const blank = (operator_name: string): OperatorReliability => ({
    operator_name,
    rang: 0,
    answered: 0,
    rawAnswerRate: 0,
    answerRate: 0,
  });

  const entryFor = (name: string): OperatorReliability => {
    let entry = byOperator.get(name);
    if (entry === undefined) {
      entry = blank(name);
      byOperator.set(name, entry);
    }
    return entry;
  };

  for (const row of rows) {
    if (row.dateint < RELIABILITY_CUTOFF_DATEINT) continue;

    for (const name of parseAssignedOperators(row.assigned_operators)) {
      entryFor(name).rang += 1;
    }

    const answeredBy = normalizeOperatorName(row.operator_name);
    if (answeredBy !== undefined) {
      entryFor(answeredBy).answered += 1;
    }
  }

  let totalOpportunities = 0;
  let totalAnswered = 0;
  for (const entry of byOperator.values()) {
    totalOpportunities += entry.rang;
    totalAnswered += entry.answered;
  }

  // An operator can answer a call that did not list them (the schedule is re-scraped, so
  // history and current schedule can disagree), which would let a rate exceed 1. Clamp.
  const globalAnswerRate =
    totalOpportunities > 0
      ? Math.min(1, totalAnswered / totalOpportunities)
      : 0;

  for (const entry of byOperator.values()) {
    entry.rawAnswerRate =
      entry.rang > 0 ? Math.min(1, entry.answered / entry.rang) : 0;
    entry.answerRate = Math.min(
      1,
      (entry.answered + OPERATOR_SHRINKAGE_K * globalAnswerRate) /
        (entry.rang + OPERATOR_SHRINKAGE_K)
    );
  }

  return {
    byOperator,
    globalAnswerRate,
    totalOpportunities,
    totalAnswered,
    answerRateFor: (operatorName: string) =>
      byOperator.get(operatorName)?.answerRate ?? globalAnswerRate,
  };
};
