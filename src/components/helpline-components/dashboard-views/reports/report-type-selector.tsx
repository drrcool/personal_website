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

import {
  getCurrentYear,
  useHelplineStore,
  type ReportType,
} from "../../state/helpline-store";

export const MonthSelector = () => {
  const { reportMonth, setReportMonth } = useHelplineStore();
  return (
    <div className="flex flex-row gap-2">
      <Select
        value={reportMonth.toString()}
        onValueChange={(value) => setReportMonth(Number(value))}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select a month" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Months</SelectLabel>
            <SelectItem value="1">January</SelectItem>
            <SelectItem value="2">February</SelectItem>
            <SelectItem value="3">March</SelectItem>
            <SelectItem value="4">April</SelectItem>
            <SelectItem value="5">May</SelectItem>
            <SelectItem value="6">June</SelectItem>
            <SelectItem value="7">July</SelectItem>
            <SelectItem value="8">August</SelectItem>
            <SelectItem value="9">September</SelectItem>
            <SelectItem value="10">October</SelectItem>
            <SelectItem value="11">November</SelectItem>
            <SelectItem value="12">December</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

const MIN_REPORT_YEAR = 2023;
export const YearSelector = () => {
  const maxYear = getCurrentYear();
  const { reportYear, setReportYear } = useHelplineStore();
  return (
    <div className="flex flex-row gap-2">
      <Select
        value={reportYear.toString()}
        onValueChange={(value) => setReportYear(Number(value))}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select a year" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Years</SelectLabel>
            {Array.from({ length: maxYear - MIN_REPORT_YEAR + 1 }, (_, i) => (
              <SelectItem key={i} value={(MIN_REPORT_YEAR + i).toString()}>
                {MIN_REPORT_YEAR + i}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export const ReportTypeSelector = () => {
  const { reportType, setReportType } = useHelplineStore();
  return (
    <div className="flex flex-row gap-2">
      <Select
        value={reportType}
        onValueChange={(value) => setReportType(value as ReportType)}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select a report type" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Report Types</SelectLabel>
            <SelectItem value="month">Month</SelectItem>
            <SelectItem value="year">Year</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};
