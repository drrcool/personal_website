"use client";
import { Card } from "@/components/ui/card";

import { useReportData } from "../dataFetchers/useReportData";
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
const Reports = () => {
  const { reportType, reportMonth, reportYear } = useHelplineStore();
  const test = useReportData();
  const timeWindow =
    reportType === "month"
      ? `${monthMap[reportMonth as keyof typeof monthMap]} ${reportYear}`
      : `${monthMap[reportMonth as keyof typeof monthMap]} ${reportYear - 1} - ${reportYear}`;
  const titleBar = `${reportType === "month" ? "Monthly" : "Yearly"} - ${timeWindow}`;

  return (
    <div className="flex flex-col gap-5 p-5">
      <ReportsToolBar />
      <Card className="p-4 text-card-foreground border-0">
        <div className="text-lg font-bold">{titleBar}</div>
        <div className="mt-5">
          <div className="grid grid-cols-3"></div>
        </div>
      </Card>
    </div>
  );
};

export default Reports;
