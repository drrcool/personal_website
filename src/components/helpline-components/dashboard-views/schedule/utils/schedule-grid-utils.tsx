import { cx } from "class-variance-authority";

import type { ScheduleData } from "@/components/helpline-components/dataFetchers/useSchedule";
import {
  SHRINKAGE_K,
  type NeedTier,
} from "@/components/helpline-components/metrics/constants";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

import type { ScheduleColorMetric } from "./schedule-metric-selector";

export const range = (start: number, end: number) =>
  Array.from({ length: end - start + 1 }, (_, i) => start + i);

const FAILURE = "var(--color-semantic-failure)";
const WARNING = "var(--color-semantic-warning)";
const SUCCESS = "var(--color-semantic-success)";
const EMPTY = "var(--muted-foreground)";

/**
 * Color functions take the whole row rather than a single value, because the need-score
 * metric needs its precomputed tier and the missed-call rate needs the call count to
 * judge how much to trust the rate.
 */
export type ScheduleColorFn = (row: ScheduleData, lastNDays: number) => string;

// 0 → green, 0.5 → yellow, 1 → red
export const callCountColor: ScheduleColorFn = ({ call_cnt }, lastNDays) => {
  const compValue = (365 * call_cnt) / lastNDays;
  if (compValue > 20) return FAILURE;
  if (compValue > 10) return WARNING;
  if (compValue === 0) return EMPTY;
  return SUCCESS;
};

const missedCallCountColor: ScheduleColorFn = (
  { missed_call_cnt },
  lastNDays
) => {
  const compValue = (365 * missed_call_cnt) / lastNDays;
  if (compValue > 8) return FAILURE;
  if (compValue > 3) return WARNING;
  if (compValue === 0) return EMPTY;
  return SUCCESS;
};

/**
 * Missed-call rate, shrunk toward 50% by {@link SHRINKAGE_K} pseudo-calls.
 *
 * Without shrinkage a 1-of-1 miss renders identically to a 20-of-20 miss, which at this
 * helpline's volumes made the metric unreadable: most hours see a handful of calls a
 * quarter, so single events dominated the color. Shrinking pulls thin evidence toward the
 * middle, so a cell has to earn a red.
 */
const missedCallRateColor: ScheduleColorFn = ({
  call_cnt,
  missed_call_cnt,
}) => {
  if (call_cnt === 0) return EMPTY;
  const shrunkRate =
    (100 * (missed_call_cnt + SHRINKAGE_K * 0.5)) / (call_cnt + SHRINKAGE_K);
  if (shrunkRate > 75) return FAILURE;
  if (shrunkRate > 50) return WARNING;
  return SUCCESS;
};

const NEED_TIER_COLORS: Record<NeedTier, string> = {
  critical: FAILURE,
  warning: WARNING,
  ok: SUCCESS,
  none: EMPTY,
};

/** Keyed on the precomputed tier so the grid and any other consumer agree. */
const needScoreColor: ScheduleColorFn = ({ need_tier }) =>
  NEED_TIER_COLORS[need_tier ?? "none"];

export const colorFnMap: Record<ScheduleColorMetric, ScheduleColorFn> = {
  need_score: needScoreColor,
  call_cnt: callCountColor,
  missed_call_cnt: missedCallCountColor,
  missed_call_rate: missedCallRateColor,
};

export const ScheduleHeader = ({ day }: { day: string }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full rounded-sm text-md font-bold text-card-foreground">
      {day}
    </div>
  );
};

const ScheduleTooltipRow = ({
  label,
  value,
}: {
  label: string;
  value?: string | number;
}) => {
  return (
    <div className="flex flex-row justify-between text-sm gap-4">
      <div className="font-bold whitespace-nowrap">{label}</div>
      {value !== undefined && (
        <div className="text-sm text-right">{String(value).slice(0, 40)}</div>
      )}
    </div>
  );
};
export const dayMap = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
};

export const ScheduleHour = ({
  data,
  hour,
  day,
  color,
}: {
  data: ScheduleData | undefined;
  hour: number;
  day: number;
  color: string | undefined;
}) => {
  const emptyData = data == undefined || data.operators_scheduled === 0;
  const santizedData: ScheduleData =
    data == undefined
      ? {
          day_of_week: day,
          hour_of_day: hour,
          operators_scheduled: 0,
          call_cnt: 0,
          missed_call_cnt: 0,
          assigned_operators: "--",
          missed_call_rate: 0,
          need_score: 0,
          need_tier: "none",
          calls_per_week: 0,
        }
      : data;

  const label = `${hour}:00`;
  const tooltipLabel = `${dayMap[day as keyof typeof dayMap]} ${label}`;
  return (
    <HoverCard openDelay={0} closeDelay={0}>
      <HoverCardTrigger>
        <div
          className={cx(
            "flex flex-col items-center justify-center w-full h-full rounded-sm",
            emptyData ? "" : "opacity-50"
          )}
          style={{ backgroundColor: color }}
        >
          {emptyData && (
            <div className="text-background font-bold text-lg">{label}</div>
          )}
        </div>
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="flex flex-col gap-2">
          <ScheduleTooltipRow label={tooltipLabel} />
          <ScheduleTooltipRow
            label="Need Score"
            value={`${santizedData.need_score.toFixed(2)}/wk`}
          />
          <ScheduleTooltipRow
            label="Calls per Week"
            value={santizedData.calls_per_week.toFixed(1)}
          />
          <ScheduleTooltipRow
            label="Attempted Calls"
            value={santizedData.call_cnt}
          />
          <ScheduleTooltipRow
            label="Missed Calls"
            value={santizedData.missed_call_cnt}
          />
          <ScheduleTooltipRow
            label="Missed Call Rate"
            value={`${santizedData.missed_call_rate.toFixed(2)}%`}
          />
          <ScheduleTooltipRow
            label="Operators"
            value={
              santizedData.operators_scheduled === 0
                ? "None scheduled"
                : santizedData.assigned_operators
            }
          />
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
