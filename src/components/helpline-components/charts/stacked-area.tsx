"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Label,
  Tooltip,
  Line,
} from "recharts";

interface StackedAreaChartProps {
  data: object[];
  xKey: string;
  yKey: string[];
  nameMap?: Record<string, string>;
  colorMap?: Record<string, string>;
  xAxisLabel?: string;
  yAxisLabel?: string;
}

const StackedAreaChart = ({
  data,
  xKey,
  yKey,
  nameMap,
  colorMap = {},
  xAxisLabel,
  yAxisLabel,
}: StackedAreaChartProps) => {
  const chartData = data.map((item) => ({
    ...item,
    __total: yKey.reduce(
      (acc, key) => acc + ((item[key as keyof typeof item] as number) ?? 0),
      0
    ),
  }));
  return (
    <ResponsiveContainer width="100%" height={"100%"}>
      <AreaChart
        data={chartData}
        margin={{
          bottom: xAxisLabel ? 30 : 0,
          left: yAxisLabel ? 20 : 0,
          right: 5,
          top: 5,
        }}
      >
        <XAxis
          dataKey={xKey}
          tick={{ transform: "translate(0, 6)" }}
          fill=""
          stroke=""
          minTickGap={20}
          tickFormatter={(value) => {
            const split = value.split("-");
            const year = split[0].slice(2);
            const month = split[1];
            return `${month}/${year}`;
          }}
        >
          <Label position="insideBottom" offset={-20}>
            {xAxisLabel}
          </Label>
        </XAxis>

        {yKey.map((key) => (
          <Area
            type="monotone"
            key={key}
            dataKey={key}
            strokeWidth={2}
            stroke={colorMap[key]}
            fill={colorMap[key]}
            name={nameMap?.[key] || key}
            stackId="1"
          />
        ))}

        <Line
          type="monotone"
          dataKey="__total"
          strokeWidth={0}
          dot={false}
          name={"Total"}
          stroke="var(--foreground)"
        />
        <Tooltip />
        <YAxis width={50} type="number" fill="" stroke="">
          <Label
            position="insideLeft"
            style={{ textAnchor: "middle" }}
            angle={-90}
            offset={-5}
          >
            {yAxisLabel}
          </Label>
        </YAxis>
      </AreaChart>
    </ResponsiveContainer>
  );
};
export default StackedAreaChart;
