import {
  Legend,
  Line,
  LineChart as ReLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { hawkinsColors } from "@/styles/chartColors";

interface LineChartProps {
  data: object[];
  xKey: string;
  yKeys: string[];
  xAxisLabel?: string;
  yAxisLabel?: string;
}

const LineChart = ({
  data,
  xKey,
  yKeys,
  xAxisLabel,
  yAxisLabel,
}: LineChartProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ReLineChart
        data={data}
        margin={{
          bottom: yAxisLabel ? 30 : 0,
          left: xAxisLabel ? 20 : 0,
          right: 5,
          top: 5,
        }}
      >
        <XAxis dataKey={xKey} />
        <YAxis />
        {yKeys.map((group, index) => (
          <Line
            type="monotone"
            dataKey={group}
            fill={hawkinsColors[index]}
            stroke={hawkinsColors[index]}
            strokeWidth={2}
            key={group}
            activeDot={{
              r: 5,
              stroke: hawkinsColors[index] as string,
              strokeWidth: 2,
              fill: hawkinsColors[index] as string,
            }}
          />
        ))}
        <Tooltip />
        <Legend />
      </ReLineChart>
    </ResponsiveContainer>
  );
};

export default LineChart;
