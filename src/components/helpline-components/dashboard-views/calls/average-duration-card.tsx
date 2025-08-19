import { ArrowDown, ArrowUp, ClockIcon } from "lucide-react";

import SummaryCard from "../../layout/summary-card";

import type { CallsSummaryCardProps } from "./calls-summary-row";

const AverageDurationCard = ({ data, isLoading }: CallsSummaryCardProps) => {
  const metric = data.current_call_duration_avg ?? 0;
  const comparisonMetric =
    ((data.current_call_duration_avg - data.year_ago_call_duration_avg) /
      data.year_ago_call_duration_avg) *
    100;
  const isPositive = comparisonMetric > 0;
  return (
    <SummaryCard
      isLoading={isLoading}
      height={150}
      cardTitle="Average Duration"
      icon={ClockIcon}
      iconClass={
        isPositive
          ? "text-[var(--color-semantic-success)]"
          : "text-[var(--color-semantic-failure)]"
      }
    >
      <div className="flex flex-col gap-2 text-card-foreground justify-between h-full">
        <div className="flex items-start flex-col justify-center flex-2 text-xl">
          <div className="font-bold text-4xl">{metric.toFixed(0)}s</div>
          <div className="flex items-center gap-1 text-muted-foreground">
            {isPositive ? (
              <ArrowUp className="w-4 h-4" />
            ) : (
              <ArrowDown className="w-4 h-4" />
            )}
            {Math.abs(comparisonMetric).toFixed(0)}% YoY
          </div>
        </div>
      </div>
    </SummaryCard>
  );
};

export default AverageDurationCard;
