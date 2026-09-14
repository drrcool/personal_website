"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart as ReBarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipContentProps,
} from "recharts";

interface AttemptRow {
  attempts: number;
  label: string;
  count: number;
}

const ROW_HEIGHT = 32;
const CHART_PADDING = 24;

const buildTooltip = (unitLabel: (count: number) => string) => {
  const AttemptsTooltip = ({
    active,
    payload,
  }: TooltipContentProps<number, string>) => {
    if (!active || !payload?.[0]) return null;
    const point = payload[0].payload as AttemptRow;
    return (
      <div className="rounded-md border border-border/60 bg-card px-3 py-2 text-sm shadow-sm">
        <div className="font-bold text-card-foreground">{point.label}</div>
        <div className="text-muted-foreground">
          {point.count} {unitLabel(point.count)}
        </div>
      </div>
    );
  };
  return AttemptsTooltip;
};

/**
 * A horizontal bar per attempt count — "1 attempt", "2 attempts", … — used identically by
 * retry burden and lost callers. The two differ only in which callers are counted and what
 * the count means, so the chart itself carries no wording specific to either.
 */
export const AttemptsDistributionChart = ({
  rows,
  color,
  unitLabel,
  emptyMessage,
}: {
  rows: ReadonlyArray<readonly [number, number]>;
  color: string;
  unitLabel: (count: number) => string;
  emptyMessage: string;
}) => {
  const data = useMemo<AttemptRow[]>(
    () =>
      rows.map(([attempts, count]) => ({
        attempts,
        label: `${attempts} attempt${attempts === 1 ? "" : "s"}`,
        count,
      })),
    [rows]
  );

  const Tooltip_ = useMemo(() => buildTooltip(unitLabel), [unitLabel]);

  if (data.length === 0) {
    return <div className="text-muted-foreground text-sm">{emptyMessage}</div>;
  }

  return (
    <div
      className="attempts-distribution-chart"
      style={{ height: data.length * ROW_HEIGHT + CHART_PADDING }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <ReBarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
          barCategoryGap="30%"
        >
          <CartesianGrid
            horizontal={false}
            stroke="var(--border)"
            strokeOpacity={0.4}
          />
          <XAxis
            type="number"
            allowDecimals={false}
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            tickLine={false}
            axisLine={{ stroke: "var(--foreground)" }}
          />
          <YAxis
            type="category"
            dataKey="label"
            width={90}
            tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
            tickLine={false}
            axisLine={{ stroke: "var(--foreground)" }}
          />
          <Tooltip content={Tooltip_} cursor={{ fill: "var(--muted)" }} />
          <Bar
            dataKey="count"
            fill={color}
            radius={[0, 3, 3, 0]}
            maxBarSize={20}
          />
        </ReBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AttemptsDistributionChart;
