import {
  Legend,
  Line,
  LineChart as ReLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface LineChartProps {
  data: object[];
  xKey: string;
  yKeys: string[];
  xAxisLabel?: string;
  yAxisLabel?: string;
}
const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff6384", "#36a2eb"];

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
            fill={colors[index]}
            stroke={colors[index]}
            key={group}
            activeDot={{
              r: 5,
              stroke: colors[index] as string,
              strokeWidth: 2,
              fill: colors[index] as string,
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
