import { ArrowDown, ArrowUp, FileX2Icon } from "lucide-react";

import SummaryCard from "../../layout/summary-card";

import type { CallsSummaryCardProps } from "./calls-summary-row";

const AbandonmentRateCard = ({ data, isLoading }: CallsSummaryCardProps) => {
  const metric =
    data.current_call_cnt > 0
      ? 100.0 * (data.current_missed_call_cnt / data.current_call_cnt)
      : 0;
  const historicalMetric =
    data.year_ago_call_cnt > 0
      ? 100.0 * (data.year_ago_missed_call_cnt / data.year_ago_call_cnt)
      : 0;
  const comparisonMetric = metric - historicalMetric;
  const isPositive = comparisonMetric > 0;
  return (
    <SummaryCard
      isLoading={isLoading}
      height={150}
      cardTitle="Abandonment Rate"
      icon={FileX2Icon}
      iconClass={
        isPositive
          ? "text-[var(--color-semantic-failure)]"
          : "text-[var(--color-semantic-success)]"
      }
    >
      <div className="flex flex-col gap-2 text-card-foreground justify-between h-full">
        <div className="flex items-start flex-col justify-center flex-2 text-xl">
          <div className="font-bold text-4xl">{metric.toFixed(0)}%</div>
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

export default AbandonmentRateCard;
