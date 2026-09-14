import {
  useSchedule,
  type ScheduleData,
} from "@/components/helpline-components/dataFetchers/useSchedule";
import SummaryCard from "@/components/helpline-components/layout/summary-card";

const getScheduleAgg = (data: Record<string, ScheduleData>) => {
  const agg = Object.values(data).reduce(
    (acc, curr) => {
      const calls = curr?.call_cnt ?? 0;
      const missedCalls = curr?.missed_call_cnt ?? 0;
      const operatorsScheduled = curr?.operators_scheduled ?? 0;
      if (operatorsScheduled > 0) {
        acc.missedCalls = acc.missedCalls + missedCalls;
        acc.scheduleHours = acc.scheduleHours + 1;
        acc.scheduledCalls = acc.scheduledCalls + calls;
      } else {
        acc.unscheduledCalls = acc.unscheduledCalls + calls;
        acc.unscheduledMissedCalls = acc.unscheduledMissedCalls + missedCalls;
      }
      acc.unscheduledHours = 24 * 7 - acc.scheduleHours;
      acc.calls = acc.calls + calls;
      return acc;
    },
    {
      missedCalls: 0,
      scheduleHours: 0,
      calls: 0,
      scheduledCalls: 0,
      unscheduledCalls: 0,
      unscheduledMissedCalls: 0,
      unscheduledHours: 0,
    }
  );
  return agg;
};

export const ScheduleSummaryCard = ({
  title,
  value,
}: {
  title: string;
  value: number | string;
}) => {
  return (
    <SummaryCard height={100}>
      <div className="flex flex-col gap-2 text-card-foreground justify-between h-full">
        <div className="flex items-start flex-col justify-center flex-2 text-xl">
          <div className="font-bold text-3xl">{value}</div>
          <div className="text-sm text-muted-foreground">{title}</div>
        </div>
      </div>
    </SummaryCard>
  );
};
const CallsInUnscheduled = () => {
  const {
    data: { schedule: scheduleData },
  } = useSchedule();
  const agg = getScheduleAgg(scheduleData);
  return (
    <ScheduleSummaryCard
      title="Calls in Unstaffed Hours"
      value={agg.unscheduledCalls}
    />
  );
};

const HoursCovered = () => {
  const {
    data: { schedule: scheduleData },
  } = useSchedule();

  const agg = getScheduleAgg(scheduleData);
  const hoursCovered = agg.scheduleHours;
  return <ScheduleSummaryCard title="Hours Covered" value={hoursCovered} />;
};
const CoverageRate = () => {
  const {
    data: { schedule: scheduleData },
  } = useSchedule();
  const agg = getScheduleAgg(scheduleData);
  const hoursCovered = agg.scheduleHours;
  const totalHours = 24 * 7;

  const coverageRate = (hoursCovered / totalHours) * 100;
  return (
    <ScheduleSummaryCard
      title="Percent of Hours Covered"
      value={`${coverageRate.toFixed(0)}%`}
    />
  );
};

const UnstaffedHours = () => {
  const {
    data: { schedule: scheduleData },
  } = useSchedule();
  const agg = getScheduleAgg(scheduleData);
  const unstaffedHours = agg.unscheduledHours;
  return <ScheduleSummaryCard title="Unstaffed Hours" value={unstaffedHours} />;
};

/**
 * Expected missed callers per week, summed across all 168 hours. This is the headline the
 * need score exists to produce: one number, in callers rather than percentages, that a
 * coordinator can repeat when asking for volunteers.
 */
const ExpectedMissedCallers = () => {
  const {
    data: { summary },
  } = useSchedule();
  return (
    <ScheduleSummaryCard
      title="Expected Missed Callers / Week"
      value={summary.total_need_score.toFixed(1)}
    />
  );
};

const ScheduleSummaryRow = () => {
  return (
    <div className="grid grid-cols-5 gap-5">
      <ExpectedMissedCallers />
      <HoursCovered />
      <UnstaffedHours />
      <CoverageRate />
      <CallsInUnscheduled />
    </div>
  );
};

export default ScheduleSummaryRow;
