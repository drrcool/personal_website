import { cx } from "class-variance-authority";
import type { LucideIcon } from "lucide-react";

const ChartContainer = ({
  children,
  isLoading = false,
  height = 400,
  cardTitle,
  icon,
  iconClass,
}: {
  children: React.ReactNode;
  isLoading?: boolean;
  height?: number;
  cardTitle?: string;
  icon?: LucideIcon | React.ComponentType;
  iconClass?: string;
}) => {
  const Icon = icon;
  const returnElement = isLoading ? <div>Loading...</div> : children;
  return (
    <div className="p-4" style={{ height }}>
      <div className="flex flex-col gap-2 h-full justify-between">
        {(Icon || cardTitle) && (
          <div className="text-lg font-bold justify-between flex flex-row items-center">
            {cardTitle && <div>{cardTitle}</div>}
            {Icon && <Icon className={cx("w-5 h-5", iconClass)} />}
          </div>
        )}
        <div className="h-full">{returnElement}</div>
      </div>
    </div>
  );
};
export default ChartContainer;
