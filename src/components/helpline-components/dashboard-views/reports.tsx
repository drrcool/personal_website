"use client";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { useReportData, type ReportData } from "../dataFetchers/useReportData";
import { useHelplineStore } from "../state/helpline-store";

import ReportsToolBar from "./reports/reports-tool-bar";

const monthMap = {
  1: "January",
  2: "February",
  3: "March",
  4: "April",
  5: "May",
  6: "June",
  7: "July",
  8: "August",
  9: "September",
  10: "October",
  11: "November",
  12: "December",
};

const getMonthFromDate = (date: number) => {
  // Date is formatted as YYYYMMDD
  return Math.floor((date % 10000) / 100);
};

const getYearFromDate = (date: number) => {
  return Math.floor(date / 10000);
};

const TableRow = ({
  metricTitle,
  current,
  past,
  pctChange,
  changeColor,
  className,
}: {
  metricTitle: string | undefined;
  current: number | string;
  past: number | string;
  pctChange: number | string;
  changeColor?: "positive" | "negative" | undefined;
  className?: string;
}) => {
  const color = changeColor
    ? changeColor === "positive"
      ? "text-green-500"
      : "text-red-500"
    : undefined;
  return (
    <div
      className={cn("grid grid-cols-4 justify-items-center text-xl", className)}
    >
      <div className="text-lg font-bold">{metricTitle}</div>
      <div className="">{current}</div>
      <div className="">{past}</div>
      <div className={cn("", color)}>{pctChange}</div>
    </div>
  );
};

const Reports = () => {
  const { reportType } = useHelplineStore();
  const {
    data: dataArray,
    currentStartDate,
    currentEndDate,
    pastStartDate,
    pastEndDate,
  } = useReportData();
  if (!dataArray || dataArray.length === 0) return null;
  const rawData = dataArray[0] as ReportData;
  const data = {
    ...rawData,
    call_cnt_pct_change:
      (100.0 * (rawData?.call_cnt - rawData?.past_call_cnt)) /
      rawData?.past_call_cnt,
    missed_call_cnt_pct_change:
      (100.0 * (rawData?.missed_call_cnt - rawData?.past_missed_call_cnt)) /
      rawData?.past_missed_call_cnt,
    missed_call_pct: (100.0 * rawData?.missed_call_cnt) / rawData?.call_cnt,
    past_missed_call_pct:
      (100.0 * rawData?.past_missed_call_cnt) / rawData?.past_call_cnt,
    past_missed_call_cnt_pct_change:
      100.0 *
      (rawData?.missed_call_cnt / rawData?.call_cnt -
        rawData?.past_missed_call_cnt / rawData?.past_call_cnt),
  };

  const timeWindow =
    reportType === "month"
      ? `${monthMap[getMonthFromDate(currentStartDate) as keyof typeof monthMap]} ${getYearFromDate(currentStartDate)}`
      : `${monthMap[getMonthFromDate(currentStartDate) as keyof typeof monthMap]} ${getYearFromDate(currentStartDate)} - ${monthMap[getMonthFromDate(currentEndDate) as keyof typeof monthMap]} ${getYearFromDate(currentEndDate)}`;
  const pastTimeWindow =
    reportType === "month"
      ? `${monthMap[getMonthFromDate(pastStartDate) as keyof typeof monthMap]} ${getYearFromDate(pastStartDate)}`
      : `${monthMap[getMonthFromDate(pastStartDate) as keyof typeof monthMap]} ${getYearFromDate(pastStartDate)} -  ${monthMap[getMonthFromDate(pastEndDate) as keyof typeof monthMap]} ${getYearFromDate(pastEndDate)}`;
  const titleBar = `${reportType === "month" ? "Monthly" : "Yearly"} Report - ${timeWindow}`;
  return (
    <div className="flex flex-col gap-5 p-5">
      <ReportsToolBar title={titleBar} />
      <Card className="p-4 text-card-foreground border-0">
        <div className="mt-5 flex flex-col gap-4">
          <TableRow
            metricTitle={undefined}
            current={timeWindow}
            past={pastTimeWindow}
            pctChange={"% Change"}
            className="font-bold text-2xl"
          />
          <TableRow
            metricTitle="Total Calls"
            current={data.call_cnt}
            past={data.past_call_cnt}
            pctChange={`${data.call_cnt_pct_change.toFixed(0)}%`}
            changeColor={data.call_cnt_pct_change > 0 ? "positive" : "negative"}
          />
          <TableRow
            metricTitle="Missed Calls"
            current={data.missed_call_cnt}
            past={data.past_missed_call_cnt}
            pctChange={`${data.missed_call_cnt_pct_change.toFixed(0)}%`}
            changeColor={
              data.missed_call_cnt_pct_change < 0 ? "positive" : "negative"
            }
          />
          <TableRow
            metricTitle="Missed Call Percentage"
            current={`${data.missed_call_pct.toFixed(0)}%`}
            past={`${data.past_missed_call_pct.toFixed(0)}%`}
            pctChange={`${data.past_missed_call_cnt_pct_change.toFixed(0)}%`}
            changeColor={
              data.past_missed_call_cnt_pct_change < 0 ? "positive" : "negative"
            }
          />
        </div>
      </Card>
    </div>
  );
};

export default Reports;
