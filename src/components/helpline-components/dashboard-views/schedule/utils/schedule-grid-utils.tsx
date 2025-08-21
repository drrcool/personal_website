import { cx } from "class-variance-authority";

import type { ScheduleData } from "@/components/helpline-components/dataFetchers/useSchedule";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export const range = (start: number, end: number) =>
  Array.from({ length: end - start + 1 }, (_, i) => start + i);

// 0 → green, 0.5 → yellow, 1 → red
export const callCountColor = (value: number, lastNDays: number): string => {
  const compValue = (365 * value) / lastNDays;
  if (compValue > 20) return "var(--color-semantic-failure)";
  if (compValue > 10) return "var(--color-semantic-warning)";
  if (compValue === 0) return "var(--muted-foreground)";
  return "var(--color-semantic-success)";
};

const missedCallCountColor = (value: number, lastNDays: number): string => {
  const compValue = (365 * value) / lastNDays;
  if (compValue > 8) return "var(--color-semantic-failure)";
  if (compValue > 3) return "var(--color-semantic-warning)";
  if (compValue === 0) return "var(--muted-foreground)";
  return "var(--color-semantic-success)";
};

const missedCallRateColor = (value: number, _: number): string => {
  if (value > 75) return "var(--color-semantic-failure)";
  if (value > 50) return "var(--color-semantic-warning)";
  if (value === 0) return "var(--muted-foreground)";
  return "var(--color-semantic-success)";
};
export const colorFnMap = {
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
    <div className="flex flex-row justify-between text-sm">
      <div className="font-bold">{label}</div>
      {value && <div className="text-sm">{String(value).slice(0, 20)}</div>}
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
            value={santizedData.assigned_operators}
          />
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
