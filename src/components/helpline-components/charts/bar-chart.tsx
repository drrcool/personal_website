interface BarChartProps {
  data: object[];
  barKey: string;
  valueKey: string;
}

const Entry = ({
  value,
  label,
  maxValue,
  color,
}: {
  value: number;
  label: string;
  maxValue: number;
  color?: string;
}) => {
  const fractionToMax = value / maxValue;
  return (
    <div className="w-full flex flex-row justify-between items-center">
      <div className="w-50 text-card-foreground">{label}</div>
      <div className="relative h-3 w-full">
        <div
          className="absolute inset-y-0 left-0 rounded transitition-[width] duration-300"
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
  );
};

const BarChart = ({ data, barKey, valueKey }: BarChartProps) => {
  const typedBarKey = barKey as keyof (typeof data)[0];
  const typedValueKey = valueKey as keyof (typeof data)[0];
  const maxValue = Math.max(...data.map((row) => row[typedValueKey]));
  return (
    <div className="flex flex-col justify-between items-center h-full">
      {data.map((row) => (
        <Entry
          key={row[typedBarKey]}
          value={row[typedValueKey]}
          label={row[typedBarKey]}
          maxValue={maxValue}
        />
      ))}
    </div>
  );
};

export default BarChart;
