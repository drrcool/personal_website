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

interface LastNDaysSelectorProps {
  className?: string;
  value: number;
  setValue: (value: number) => void;
  title: string;
}
export const LastNDaysSelector = ({
  className,
  value,
  setValue,
  title,
}: LastNDaysSelectorProps) => {
  return (
    <div className={className}>
      <Select
        value={value.toString()}
        onValueChange={(value) => setValue(Number(value))}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select a helpline" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{title}</SelectLabel>
            <SelectItem value="30">30 days</SelectItem>
            <SelectItem value="90">90 days</SelectItem>
            <SelectItem value="180">6 months</SelectItem>
            <SelectItem value="365">1 year</SelectItem>
            <SelectItem value="7300">All</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};
