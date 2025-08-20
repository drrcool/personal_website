import { Label } from "@/components/ui/label";

import { ScheduleMetricSelector } from "../dashboard-views/calls/schedule/utils/schedule-metric-selector";
import { LastNDaysSelector } from "../inputs/last-n-days-selector";
import { useHelplineStore } from "../state/helpline-store";

export const HelplineToolsBar = ({
  title,
  showDaySeletor = true,
  showMetricSelector = false,
}: {
  title: string;
  showDaySeletor?: boolean;
  showMetricSelector?: boolean;
}) => {
  const { lastNDays, setLastNDays, colorMetric, setColorMetric } =
    useHelplineStore();
  return (
    <div className="p-4">
      <div className="tool-row flex flex-row gap-5 justify-between items-center">
        <div className="font-bold text-2xl">{title}</div>
        <div className="flex flex-row gap-5">
          {showMetricSelector && (
            <Label>
              Color By:
              <ScheduleMetricSelector
                metric={colorMetric}
                setMetric={setColorMetric}
              />
            </Label>
          )}
          {showDaySeletor && (
            <LastNDaysSelector
              value={lastNDays}
              setValue={setLastNDays}
              title="Stat Range"
            />
          )}
        </div>
      </div>
    </div>
  );
};
