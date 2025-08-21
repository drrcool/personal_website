import { Label } from "@/components/ui/label";

import {
  MonthSelector,
  ReportTypeSelector,
  YearSelector,
} from "./report-type-selector";

const ReportsToolBar = () => {
  return (
    <div className="p-4">
      <div className="flex flex-row gap-5 justify-between items-end">
        <div className="font-bold text-2xl">Reports</div>
        <div className="flex flex-row gap-4">
          <div className="flex flex-col gap-4">
            <Label>Report Type:</Label>
            <ReportTypeSelector />
          </div>
          <div className="flex flex-col gap-4">
            <Label>Report End Month:</Label>
            <MonthSelector />
          </div>
          <div className="flex flex-col gap-4">
            <Label>Report End Year:</Label>
            <YearSelector />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsToolBar;
