"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type ScheduleColorMetric =
  | "call_cnt"
  | "missed_call_cnt"
  | "missed_call_rate";
interface ScheduleMetricSelectorProps {
  metric: ScheduleColorMetric;
  setMetric: (value: ScheduleColorMetric) => void;
}
export const ScheduleMetricSelector = ({
  metric,
  setMetric,
}: ScheduleMetricSelectorProps) => {
  return (
    <Select value={metric} onValueChange={setMetric}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select a metric" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Color By:</SelectLabel>
          <SelectItem value="call_cnt">Call Count</SelectItem>
          <SelectItem value="missed_call_cnt">Missed Call Count</SelectItem>
          <SelectItem value="missed_call_rate">Missed Call Rate</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
