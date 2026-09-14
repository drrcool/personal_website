"use client";

import { Card } from "@/components/ui/card";

import { useCallerExperience } from "../dataFetchers/useCallerExperience";
import { useSchedule } from "../dataFetchers/useSchedule";
import { HelplineToolsBar } from "../layout/helpline-tools-bar";
import { LOST_CALLER_GRACE_DAYS } from "../metrics/constants";

import { AttemptsDistributionChart } from "./caller-experience/attempts-distribution-chart";
import { ScheduleSummaryCard } from "./schedule/schedule-summary";

const Explainer = ({ children }: { children: React.ReactNode }) => (
  <p className="text-sm text-muted-foreground">{children}</p>
);

const CallerExperienceView = () => {
  const { data, isLoading } = useCallerExperience();
  const {
    data: { summary },
  } = useSchedule();

  if (isLoading || !data) {
    return (
      <div className="flex flex-col gap-5 p-5">
        <HelplineToolsBar title="Caller Experience" />
        <Card className="p-4 border-0">
          <div className="text-muted-foreground">Loading caller activity…</div>
        </Card>
      </div>
    );
  }

  const retryShare =
    data.totalCallers > 0
      ? (100 * data.callersNeedingRetry) / data.totalCallers
      : 0;

  const attemptRows = [...data.attemptsDistribution.entries()].sort(
    (a, b) => a[0] - b[0]
  );
  const lostAttemptRows = [...data.lostAttemptsDistribution.entries()].sort(
    (a, b) => a[0] - b[0]
  );

  return (
    <div className="flex flex-col gap-5 p-5">
      <HelplineToolsBar title="Caller Experience" />

      <Explainer>
        What reaching this helpline looks like from the caller&apos;s side.
        Freedom Voice records no time-to-answer, so these are inferred from what
        callers actually did — whether they had to try again, and whether they
        ever came back.
      </Explainer>

      <div className="grid grid-cols-4 gap-5">
        <ScheduleSummaryCard
          title="Expected Missed Callers / Week"
          value={summary.total_need_score.toFixed(1)}
        />
        <ScheduleSummaryCard title="Lost Callers" value={data.lostCallers} />
        <ScheduleSummaryCard
          title="Callers Who Had to Retry"
          value={data.callersNeedingRetry}
        />
        <ScheduleSummaryCard
          title="Distinct Callers"
          value={data.totalCallers}
        />
      </div>

      <Card className="p-4 flex flex-col gap-2 border-0">
        <div className="font-bold text-xl text-card-foreground">
          Lost callers
        </div>
        <Explainer>
          Callers whose call went unanswered and who never called back. Shares
          its unit with the schedule&apos;s need score — callers lost — so the
          two read as one figure. A miss within the last{" "}
          {LOST_CALLER_GRACE_DAYS} days is not counted yet, since the caller may
          simply not have tried again: {data.tooRecentToJudge} caller
          {data.tooRecentToJudge === 1 ? "" : "s"} currently held back for that
          reason.
        </Explainer>
        <AttemptsDistributionChart
          rows={lostAttemptRows}
          color="var(--color-semantic-failure)"
          unitLabel={(count) => `caller${count === 1 ? "" : "s"}`}
          emptyMessage="No caller was lost in this window."
        />
      </Card>

      <Card className="p-4 flex flex-col gap-3 border-0">
        <div className="font-bold text-xl text-card-foreground">
          Retry burden
        </div>
        <Explainer>
          Callers who had to place more than one call in a single sitting before
          reaching someone — {retryShare.toFixed(0)}% of all callers, costing{" "}
          {data.extraAttempts} extra call
          {data.extraAttempts === 1 ? "" : "s"} in total.
        </Explainer>
        <AttemptsDistributionChart
          rows={attemptRows}
          color="var(--color-semantic-warning)"
          unitLabel={(count) => `time${count === 1 ? "" : "s"}`}
          emptyMessage="No caller needed a second attempt in this window."
        />
      </Card>
    </div>
  );
};

export default CallerExperienceView;
