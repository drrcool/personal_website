import { PhoneCall, PhoneMissed } from "lucide-react";

import { useLastRecievedCall } from "../../dataFetchers/useLastRecievedCall";
import SummaryCard from "../../layout/summary-card";
import type { HelplineID } from "../../state/helpline-store";

const defaultDateTimeReturn = {
  year: "--",
  month: "--",
  day: "--",
  cleanedTime: "--",
};
const formatDateAndTime = (dateTime: string | null | undefined) => {
  if (!dateTime) return defaultDateTimeReturn;
  const dateSplit = dateTime.split("+")[0]?.split("T");
  const yearMonthDay = dateSplit?.[0]?.split("-");
  const cleanedTime = dateSplit?.[1]?.slice(0, 5);
  const year = yearMonthDay?.[0]?.slice(2);
  const month = yearMonthDay?.[1];
  const day = yearMonthDay?.[2];
  return { year, month, day, cleanedTime };
};

const isCleanedMissedCall = (isMissedCall: number | null | undefined) => {
  if (isMissedCall === null || isMissedCall === 1) return true;
  return false;
};
const getCallIcon = (isMissedCall: number | null | undefined) => {
  const cleanedMissedCall = isCleanedMissedCall(isMissedCall);
  if (cleanedMissedCall) return PhoneMissed;
  return PhoneCall;
};

const getCallColor = (isMissedCall: number | null | undefined) => {
  const cleanedMissedCall = isCleanedMissedCall(isMissedCall);
  if (cleanedMissedCall) return "text-[var(--color-semantic-failure)]";
  return "text-[var(--color-semantic-success)]";
};

const MostRecentCall = ({ helplineId }: { helplineId: HelplineID }) => {
  const { data: lastCall, isLoading } = useLastRecievedCall(helplineId);
  const cleanedDate = formatDateAndTime(lastCall?.call_time);
  return (
    <SummaryCard
      isLoading={isLoading}
      height={200}
      cardTitle="Most Recent Call"
      icon={getCallIcon(lastCall?.is_missed_call)}
      iconClass={getCallColor(lastCall?.is_missed_call)}
    >
      <div className="grid grid-rows-[6fr_1fr] gap-2 text-card-foreground h-full w-full">
        <div className=" flex flex-row justify-between gap-5 text-xl items-end">
          <div className="font-bold text-4xl">{`${cleanedDate.month}/${cleanedDate.day}`}</div>
          <div>{cleanedDate.cleanedTime}</div>
        </div>
        <div className="flex flex-row gap-2 justify-between items-end">
          <div>{lastCall?.caller_state}</div>
          <div>{lastCall?.duration_seconds}s</div>
        </div>
      </div>
    </SummaryCard>
  );
};

export default MostRecentCall;
