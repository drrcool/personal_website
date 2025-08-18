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

import { chartColors } from "@/styles/chartColors";

interface StackedAreaChartProps {
  data: Array<Record<string, number | string | null>>;
  xKey: string;
  yKey: string[];
  nameMap?: Record<string, string>;
  xAxisLabel?: string;
  yAxisLabel?: string;
}

const StackedAreaChart = ({
  data,
  xKey,
  yKey,
  nameMap,
  xAxisLabel,
  yAxisLabel,
}: StackedAreaChartProps) => {
  const chartData = data.map((item) => ({
    ...item,
    __total: yKey.reduce((acc, key) => acc + ((item[key] as number) ?? 0), 0),
  }));
  return (
    <ResponsiveContainer width="100%" height={400}>
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
          tickLine={false}
          axisLine={false}
          minTickGap={10}
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

        {yKey.map((key, index) => (
          <Area
            type="monotone"
            key={key}
            dataKey={key}
            stroke={chartColors[index]}
            fill={chartColors[index]}
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
        <YAxis
          width={50}
          axisLine={false}
          tickLine={false}
          type="number"
          fill=""
          stroke=""
        >
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
