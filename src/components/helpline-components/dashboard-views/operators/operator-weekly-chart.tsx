"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart as ReBarChart,
  Cell,
  Label,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipContentProps,
} from "recharts";

import {
  computeOperatorWeeklyActivity,
  type WeeklyActivity,
  type WeeklyActivityCallRow,
  type WeeklyAnswerTier,
} from "../../metrics/operator-weekly-activity";

const TIER_COLOR: Record<WeeklyAnswerTier, string> = {
  good: "var(--color-semantic-success)",
  ok: "var(--color-semantic-warning)",
  poor: "var(--color-semantic-failure)",
  none: "var(--muted-foreground)",
};

const TIER_LABEL: Record<WeeklyAnswerTier, string> = {
  good: "Answered most",
  ok: "Answered some",
  poor: "Rarely answered",
  none: "No calls",
};

const DATE_LABEL = new Intl.DateTimeFormat(undefined, {
  month: "short",
  day: "numeric",
});

interface WeekPoint extends WeeklyActivity {
  weekLabel: string;
}

const WeeklyTooltip = ({
  active,
  payload,
}: TooltipContentProps<number, string>) => {
  if (!active || !payload?.[0]) return null;
  const point = payload[0].payload as WeekPoint;
  const rateLabel =
    point.answerRate === undefined
      ? "no calls that week"
      : `${(100 * point.answerRate).toFixed(0)}% answered`;
  return (
    <div className="rounded-md border border-border/60 bg-card px-3 py-2 text-sm shadow-sm">
      <div className="font-bold text-card-foreground">{point.weekLabel}</div>
      <div className="text-muted-foreground">
        {point.rang} call{point.rang === 1 ? "" : "s"} · {rateLabel}
      </div>
    </div>
  );
};

/**
 * One operator's call volume over the trailing year, one bar per week, colored by the
 * fraction of that week's calls they personally answered. Bar height is calls-per-week;
 * color is responsiveness — so a tall red bar (busy week, rarely picked up) reads
 * differently from a short one (quiet week, nothing to answer).
 */
export const OperatorWeeklyChart = ({
  calls,
  operatorName,
}: {
  calls: readonly WeeklyActivityCallRow[];
  operatorName: string;
}) => {
  const data = useMemo<WeekPoint[]>(
    () =>
      computeOperatorWeeklyActivity({ calls, operatorName }).map((week) => ({
        ...week,
        weekLabel: DATE_LABEL.format(week.weekStart),
      })),
    [calls, operatorName]
  );

  return (
    <div className="flex flex-col gap-2 py-3">
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ReBarChart
            data={data}
            margin={{ top: 5, right: 10, left: 0, bottom: 20 }}
            barCategoryGap={0}
          >
            <XAxis
              dataKey="weekLabel"
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              minTickGap={24}
              tickLine={false}
            />
            <YAxis
              width={40}
              allowDecimals={false}
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              tickLine={false}
            >
              <Label
                value="Calls / week"
                position="insideLeft"
                angle={-90}
                style={{
                  textAnchor: "middle",
                  fill: "var(--muted-foreground)",
                  fontSize: 12,
                }}
              />
            </YAxis>
            <Tooltip
              content={WeeklyTooltip}
              cursor={{ fill: "var(--muted)" }}
            />
            <Bar dataKey="rang" radius={[1, 1, 0, 0]}>
              {data.map((week) => (
                <Cell key={week.weeksAgo} fill={TIER_COLOR[week.tier]} />
              ))}
            </Bar>
          </ReBarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-row flex-wrap gap-4 text-xs text-muted-foreground">
        {(["good", "ok", "poor", "none"] as const).map((tier) => (
          <div key={tier} className="flex items-center gap-1.5">
            <span
              className="inline-block w-2 h-2 rounded-full"
              style={{ backgroundColor: TIER_COLOR[tier] }}
            />
            {TIER_LABEL[tier]}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OperatorWeeklyChart;
