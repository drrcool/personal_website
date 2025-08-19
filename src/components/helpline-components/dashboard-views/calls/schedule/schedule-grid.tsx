import { cx } from "class-variance-authority";

import {
  useSchedule,
  type ScheduleData,
} from "@/components/helpline-components/dataFetchers/useSchedule";
import { useHelplineStore } from "@/components/helpline-components/state/helpline-store";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

// utils/range.ts
export const range = (start: number, end: number) =>
  Array.from({ length: end - start + 1 }, (_, i) => start + i);

// 0 → green, 0.5 → yellow, 1 → red
export function heatColor(value: number, lastNDays: number): string {
  const compValue = (30.0 * value) / lastNDays;
  if (compValue > 1.0) return "var(--color-semantic-failure)";
  if (compValue > 0.5) return "var(--color-semantic-warning)";
  return "var(--color-semantic-success)";
}

const ScheduleHeader = ({ day }: { day: string }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full rounded-sm text-md font-bold">
      {day}
    </div>
  );
};

const ScheduleHour = ({
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
          <div className="text-black">{label}</div>
        </div>
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="text-md font-bold">
          call cnt: {santizedData.call_cnt}
        </div>
        <div className="text-md font-bold">
          missed: {santizedData.missed_call_cnt}
        </div>
        <div className="text-md font-bold">
          {santizedData.assigned_operators}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

const dayMap = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
};
const ScheduleGrid = () => {
  const { lastNDays } = useHelplineStore();
  const { data: scheduleData } = useSchedule();
  const { schedule: data } = scheduleData;

  const DAYS_OF_WEEK = range(0, 6);
  const HOURS_OF_DAY = range(0, 23);

  const schedule = HOURS_OF_DAY.map((hour) => {
    return DAYS_OF_WEEK.map((day) => {
      return { day, hour };
    });
  });

  const colorScaleColumn = "call_cnt";
  const getColor = (value: number) => heatColor(value, lastNDays);

  return (
    <div className="grid justify-center gap-x-2 gap-y-1 [grid-template-columns:repeat(7,minmax(0,10rem))] [grid-auto-rows:2rem]">
      {DAYS_OF_WEEK.map((day) => {
        return (
          <ScheduleHeader day={dayMap[day as keyof typeof dayMap]} key={day} />
        );
      })}
      {schedule.map((hour) => {
        return hour.map((day) => {
          return (
            <ScheduleHour
              hour={day.hour}
              day={day.day}
              key={`${day.day}-${day.hour}`}
              data={data[`${day.day}-${day.hour}`]}
              color={getColor(
                data[`${day.day}-${day.hour}`]?.[colorScaleColumn] ?? 0
              )}
            />
          );
        });
      })}
    </div>
  );
};

export default ScheduleGrid;
