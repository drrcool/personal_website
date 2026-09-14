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
  | "need_score"
  | "call_cnt"
  | "missed_call_cnt"
  | "missed_call_rate";

const METRIC_LABELS: Record<ScheduleColorMetric, string> = {
  need_score: "Need Score",
  call_cnt: "Call Count",
  missed_call_cnt: "Missed Call Count",
  missed_call_rate: "Missed Call Rate",
};

/** Need score leads: it is the question the Schedule tab exists to answer. */
const METRIC_ORDER: ScheduleColorMetric[] = [
  "need_score",
  "call_cnt",
  "missed_call_cnt",
  "missed_call_rate",
];

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
          {METRIC_ORDER.map((value) => (
            <SelectItem key={value} value={value}>
              {METRIC_LABELS[value]}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
