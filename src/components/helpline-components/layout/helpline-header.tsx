import { HelplineSelector } from "../inputs/helpline-selector";

const BannerHeader = () => {
  return (
    <div className="flex flex-row gap-2 w-full justify-between items-center h-16 px-6 py-4 bg-card shadow">
      <div className="flex flex-row gap-6 items-center">
        <div className="text-xl font-semibold">Helpline Dashboard</div>
        <HelplineSelector />
      </div>
    </div>
  );
};

const HelplineHeader = () => {
  return (
    <div className="flex flex-col gap-0 w-full">
      <BannerHeader />
    </div>
  );
};

export default HelplineHeader;
