import { LastNDaysSelector } from "../inputs/last-n-days-selector";
import { useHelplineStore } from "../state/helpline-store";

export const HelplineToolsBar = ({
  title,
  showDaySeletor = true,
}: {
  title: string;
  showDaySeletor?: boolean;
}) => {
  const { lastNDays, setLastNDays } = useHelplineStore();
  return (
    <div className="p-4">
      <div className="tool-row flex flex-row gap-5 justify-between items-center">
        <div className="font-bold text-2xl">{title}</div>
        <div className="flex flex-row gap-5">
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
