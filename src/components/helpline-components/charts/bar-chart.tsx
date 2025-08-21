import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@radix-ui/react-hover-card";

import type { OperatorStats } from "../dataFetchers/useOperatorStats";

interface BarChartProps {
  data: OperatorStats[];
  barKey: string;
  valueKey: string;
  subMetricKey?: string | undefined;
  tooltipContent?: (row: OperatorStats) => React.ReactNode;
}

const Entry = ({
  value,
  label,
  maxValue,
  color,
  subMetricValue,
  subMetricMaxValue,
  tooltipContent,
}: {
  value: number;
  label: string;
  maxValue: number;
  color?: string;
  subMetricValue?: number;
  subMetricMaxValue?: number;
  tooltipContent: React.ReactNode | undefined;
}) => {
  const fractionToMax = value / maxValue;
  const subMetricFractionToMax =
    subMetricValue && subMetricMaxValue
      ? subMetricValue / subMetricMaxValue
      : 0;
  return (
    <div className="w-full ">
      <HoverCard openDelay={0} closeDelay={0}>
        <HoverCardTrigger asChild>
          <div className="w-full flex flex-row justify-between items-center">
            <div className="w-50 text-card-foreground">{label}</div>
            <div className="flex flex-col gap-0 w-full">
              <div className="flex flex-row justify-between items-center">
                <div className="relative h-2 w-full">
                  <div
                    className="absolute inset-y-0 left-0 rounded transition-[width] duration-300"
                    style={{
                      width: `${fractionToMax * 100}%`,
                      backgroundColor: color ?? "var(--color-primary)",
                    }}
                  />
                </div>
                <div className="text-card-foreground w-15 text-right">
                  {value.toFixed(0)}
                </div>
              </div>
              {subMetricValue && subMetricMaxValue && (
                <div className="flex flex-row justify-between items-center">
                  <div className="relative h-2 w-full">
                    <div
                      className="absolute inset-y-0 left-0 rounded transition-[width] duration-300"
                      style={{
                        width: `${subMetricFractionToMax * 100}%`,
                        backgroundColor: color ?? "var(--chart-5)",
                      }}
                    />
                  </div>
                  <div className="text-card-foreground w-15 text-right">
                    {subMetricValue.toFixed(0)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </HoverCardTrigger>
        <HoverCardContent className="z-50">{tooltipContent}</HoverCardContent>
      </HoverCard>
    </div>
  );
};

const BarChart = ({
  data,
  barKey,
  valueKey,
  subMetricKey,
  tooltipContent,
}: BarChartProps) => {
  const typedBarKey = barKey as keyof Pick<OperatorStats, "operator_name">;
  const typedValueKey = valueKey as keyof Omit<OperatorStats, "operator_name">;
  const typedSubMetricKey = subMetricKey as keyof Omit<
    OperatorStats,
    "operator_name"
  >;
  const maxValue =
    data.length > 0 ? Math.max(...data.map((row) => row[typedValueKey])) : 1;
  const subMetricMaxValue =
    data.length > 0
      ? Math.max(...data.map((row) => row[typedSubMetricKey]))
      : 1;
  return (
    <div className="flex flex-col justify-between items-center h-full">
      {data.map((row) => (
        <Entry
          key={row[typedBarKey]}
          value={row[typedValueKey]}
          label={row[typedBarKey]}
          maxValue={maxValue}
          subMetricValue={row[typedSubMetricKey]}
          subMetricMaxValue={subMetricMaxValue}
          tooltipContent={tooltipContent?.(row)}
        />
      ))}
    </div>
  );
};

export default BarChart;
