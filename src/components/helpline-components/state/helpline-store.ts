import { useEffect } from "react";
import { create } from "zustand";

import type { ScheduleColorMetric } from "../dashboard-views/schedule/utils/schedule-metric-selector";

// Formatted as YYYYMMDD
const getNDaysAgo = (n: number): number => {
  const date = new Date();
  date.setDate(date.getDate() - n);
  return Number(date.toISOString().split("T")?.[0]?.replace(/-/g, ""));
};

const getPreviousMonth = () => {
  const date = new Date();
  date.setMonth(date.getMonth() - 1);
  return Number(date.toISOString().split("T")?.[0]?.split("-")?.[1]);
};

export const getCurrentYear = () => {
  const date = new Date();
  return date.getFullYear();
};

export type ReportType = "month" | "year";
export type HelplineID = "GSC" | "NORCAL";
interface HelplineStateValues {
  helplineId: HelplineID;
  lastNDays: number;
  timeseriesLastNDays: number;
  lastNDaysDateint: number;
  timeseriesStartDate: number;
  colorMetric: ScheduleColorMetric;
  reportType: ReportType;
  reportMonth: number;
  reportYear: number;
}
const defaultState: HelplineStateValues = {
  helplineId: "GSC",
  lastNDays: 30,
  timeseriesLastNDays: 7300,
  lastNDaysDateint: getNDaysAgo(30),
  timeseriesStartDate: getNDaysAgo(7300),
  colorMetric: "call_cnt",
  reportType: "month",
  reportMonth: getPreviousMonth(),
  reportYear: getCurrentYear(),
};

interface HelplineState extends HelplineStateValues {
  setHelplineId: (helplineId: HelplineID) => void;
  setLastNDays: (lastNDays: number) => void;
  setLastNDaysDateint: (lastNDaysDateint: number) => void;
  setTimeseriesStartDate: (startDate: number) => void;
  setTimeseriesLastNDays: (lastNDays: number) => void;
  setColorMetric: (colorMetric: ScheduleColorMetric) => void;
  setReportType: (reportType: ReportType) => void;
  setReportMonth: (reportMonth: number) => void;
  setReportYear: (reportYear: number) => void;
}
export const useStore = create<HelplineState>((set) => ({
  ...defaultState,
  setHelplineId: (helplineId: HelplineID) => set({ helplineId }),
  setLastNDays: (lastNDays: number) => set({ lastNDays }),
  setLastNDaysDateint: (lastNDaysDateInt: number) =>
    set({ lastNDaysDateint: lastNDaysDateInt }),
  setTimeseriesStartDate: (startDate: number) =>
    set({ timeseriesStartDate: startDate }),
  setTimeseriesLastNDays: (lastNDays: number) =>
    set({ timeseriesLastNDays: lastNDays }),
  setColorMetric: (colorMetric: ScheduleColorMetric) => set({ colorMetric }),
  setReportType: (reportType: ReportType) => set({ reportType }),
  setReportMonth: (reportMonth: number) => set({ reportMonth }),
  setReportYear: (reportYear: number) => set({ reportYear }),
}));

export const useHelplineStore = () => {
  const {
    helplineId,
    lastNDays,
    lastNDaysDateint,
    timeseriesStartDate,
    timeseriesLastNDays,
    setHelplineId,
    setLastNDays,
    setLastNDaysDateint,
    setTimeseriesStartDate,
    setTimeseriesLastNDays,
    colorMetric,
    setColorMetric,
    reportType,
    setReportType,
    reportMonth,
    reportYear,
    setReportMonth,
    setReportYear,
  } = useStore();
  useEffect(() => {
    setTimeseriesStartDate(getNDaysAgo(timeseriesLastNDays));
  }, [timeseriesLastNDays, setTimeseriesStartDate]);
  useEffect(() => {
    setLastNDaysDateint(getNDaysAgo(lastNDays));
  }, [lastNDays, setLastNDaysDateint]);

  return {
    helplineId,
    lastNDays,
    lastNDaysDateint,
    setHelplineId,
    setLastNDays,
    timeseriesLastNDays,
    timeseriesStartDate,
    setTimeseriesLastNDays,
    colorMetric,
    setColorMetric,
    reportType,
    setReportType,
    reportMonth,
    reportYear,
    setReportMonth,
    setReportYear,
  };
};
