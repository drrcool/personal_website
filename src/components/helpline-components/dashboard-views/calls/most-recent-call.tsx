import { PhoneCall, PhoneMissed } from "lucide-react";

import { useLastReceivedCall } from "../../dataFetchers/useLastReceivedCall";
import SummaryCard from "../../layout/summary-card";
import { useHelplineStore } from "../../state/helpline-store";

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

const MostRecentCall = () => {
  const { helplineId } = useHelplineStore();
  const { data: lastCall, isLoading } = useLastReceivedCall(helplineId);
  const cleanedDate = formatDateAndTime(lastCall?.call_time);
  return (
    <SummaryCard
      isLoading={isLoading}
      height={150}
      cardTitle="Most Recent Call"
      icon={getCallIcon(lastCall?.is_missed_call)}
      iconClass={getCallColor(lastCall?.is_missed_call)}
    >
      <div className="flex flex-col gap-2 text-card-foreground justify-between h-full">
        <div className="flex items-start flex-col justify-center flex-2 text-xl">
          <div className="font-bold text-4xl">{`${cleanedDate.month}/${cleanedDate.day}`}</div>
          <div className="text-muted-foreground">{cleanedDate.cleanedTime}</div>
        </div>
      </div>
    </SummaryCard>
  );
};

export default MostRecentCall;
