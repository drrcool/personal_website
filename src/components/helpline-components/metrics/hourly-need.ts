import {
  SHRINKAGE_K,
  needTierFor,
  parseAssignedOperators,
  type NeedTier,
} from "./constants";
import type { ReliabilityTable } from "./operator-reliability";

/** A `hourly_schedule` row: who is scheduled for an hour of the week. */
export interface ScheduleCellRow {
  day_of_week: number;
  hour_of_day: number;
  operators_scheduled: number | null;
  assigned_operators: string | null;
}

/** Aggregated call volume for an hour of the week. */
export interface HourlyCallAggregate {
  day_of_week: number;
  hour_of_day: number;
  call_cnt: number;
  missed_call_cnt: number;
}

export interface HourlyNeed {
  day_of_week: number;
  hour_of_day: number;
  operators_scheduled: number;
  assigned_operators: string;
  call_cnt: number;
  missed_call_cnt: number;
  /** Demand weight: calls attributable to this hour per week of the window. */
  calls_per_week: number;
  /** Π(1 − rᵢ) over scheduled operators. 1 for an unstaffed hour. */
  p_struct: number;
  /** Observed missed rate, shrunk toward the helpline's global rate. */
  p_obs: number;
  /** Evidence weight on observation: call_cnt / (call_cnt + k). */
  w: number;
  /** w·p_obs + (1 − w)·p_struct. */
  p_missed: number;
  /** calls_per_week × p_missed — expected missed callers per week. */
  need_score: number;
  need_tier: NeedTier;
}

const cellKey = (day_of_week: number, hour_of_day: number) =>
  `${day_of_week}-${hour_of_day}`;

export interface HourlyNeedInput {
  schedule: readonly ScheduleCellRow[];
  calls: readonly HourlyCallAggregate[];
  /** Length of the selected call window, in weeks. Values ≤ 0 are treated as one week. */
  weeksInWindow: number;
  reliability: ReliabilityTable;
}

export interface HourlyNeedResult {
  byCell: Map<string, HourlyNeed>;
  /** Σ need_score across every hour — expected missed callers per week, all hours. */
  totalNeedScore: number;
  /** The helpline's overall missed-call rate across the window. */
  globalMissedRate: number;
}

/**
 * Computes the per-hour need score: expected missed callers per week.
 *
 * The score blends two estimates. `p_obs` is what the hour's own missed-call history says,
 * shrunk toward the helpline's global rate so a 1-of-1 miss does not read as certain
 * failure. `p_struct` is what the schedule says should happen given the reliability of the
 * operators covering it — the term that lets an hour already covered by three unreliable
 * operators score worse than one covered by a single reliable one.
 *
 * They are blended by evidence: `w = call_cnt / (call_cnt + k)`, so a busy hour leans on
 * its own record and a quiet hour falls back to structure.
 */
export const computeHourlyNeed = ({
  schedule,
  calls,
  weeksInWindow,
  reliability,
}: HourlyNeedInput): HourlyNeedResult => {
  const weeks = weeksInWindow > 0 ? weeksInWindow : 1;

  const callsByCell = new Map<string, HourlyCallAggregate>();
  let totalCalls = 0;
  let totalMissed = 0;
  for (const row of calls) {
    callsByCell.set(cellKey(row.day_of_week, row.hour_of_day), row);
    totalCalls += row.call_cnt;
    totalMissed += row.missed_call_cnt;
  }
  const globalMissedRate = totalCalls > 0 ? totalMissed / totalCalls : 0;

  const byCell = new Map<string, HourlyNeed>();
  let totalNeedScore = 0;

  // Union of scheduled hours and hours that received calls, so an hour with calls but no
  // schedule row still gets scored.
  const keys = new Set<string>();
  const scheduleByCell = new Map<string, ScheduleCellRow>();
  for (const row of schedule) {
    const key = cellKey(row.day_of_week, row.hour_of_day);
    scheduleByCell.set(key, row);
    keys.add(key);
  }
  for (const key of callsByCell.keys()) keys.add(key);

  for (const key of keys) {
    const scheduleRow = scheduleByCell.get(key);
    const callRow = callsByCell.get(key);

    const [day_of_week, hour_of_day] = key.split("-").map(Number) as [
      number,
      number,
    ];

    const call_cnt = callRow?.call_cnt ?? 0;
    const missed_call_cnt = callRow?.missed_call_cnt ?? 0;
    const assigned_operators = scheduleRow?.assigned_operators ?? "--";
    const operators = parseAssignedOperators(assigned_operators);

    // Reported count can disagree with the parsed list; trust whichever says staffed so an
    // hour is never treated as unstaffed while naming operators.
    const operators_scheduled = Math.max(
      scheduleRow?.operators_scheduled ?? 0,
      operators.length
    );

    // Everyone independently failing to pick up. No operators ⇒ certain failure.
    const p_struct = operators.reduce(
      (product, name) => product * (1 - reliability.answerRateFor(name)),
      1
    );

    const p_obs =
      (missed_call_cnt + SHRINKAGE_K * globalMissedRate) /
      (call_cnt + SHRINKAGE_K);

    const w = call_cnt / (call_cnt + SHRINKAGE_K);
    const p_missed = w * p_obs + (1 - w) * p_struct;

    const calls_per_week = call_cnt / weeks;
    const need_score = calls_per_week * p_missed;

    totalNeedScore += need_score;
    byCell.set(key, {
      day_of_week,
      hour_of_day,
      operators_scheduled,
      assigned_operators,
      call_cnt,
      missed_call_cnt,
      calls_per_week,
      p_struct,
      p_obs,
      w,
      p_missed,
      need_score,
      need_tier: needTierFor(need_score),
    });
  }

  return { byCell, totalNeedScore, globalMissedRate };
};
