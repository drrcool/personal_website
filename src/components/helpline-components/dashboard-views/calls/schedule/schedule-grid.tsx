import { useSchedule } from "@/components/helpline-components/dataFetchers/useSchedule";
import { useHelplineStore } from "@/components/helpline-components/state/helpline-store";

import {
  dayMap,
  range,
  ScheduleHeader,
  ScheduleHour,
  colorFnMap,
} from "./utils/schedule-grid-utils";

const ScheduleGrid = () => {
  const { lastNDays, colorMetric } = useHelplineStore();
  const { data: scheduleData } = useSchedule();
  const { schedule: data } = scheduleData;

  const DAYS_OF_WEEK = range(0, 6);
  const HOURS_OF_DAY = range(0, 23);

  const schedule = HOURS_OF_DAY.map((hour) => {
    return DAYS_OF_WEEK.map((day) => {
      return { day, hour };
    });
  });

  const getColor = (value: number) => colorFnMap[colorMetric](value, lastNDays);

  return (
    <div>
      <div className="grid justify-center gap-x-2 gap-y-1 [grid-template-columns:repeat(7,minmax(0,10rem))] [grid-auto-rows:2rem]">
        {DAYS_OF_WEEK.map((day) => {
          return (
            <ScheduleHeader
              day={dayMap[day as keyof typeof dayMap]}
              key={day}
            />
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
                  data[`${day.day}-${day.hour}`]?.[colorMetric] ?? 0
                )}
              />
            );
          });
        })}
      </div>
    </div>
  );
};

export default ScheduleGrid;
