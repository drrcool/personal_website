"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useHelplineStore } from "../state/helpline-store";

export const HelplineSelector = () => {
  const { helplineId, setHelplineId } = useHelplineStore();
  return (
    <Select value={helplineId} onValueChange={setHelplineId}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select a helpline" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Helplines</SelectLabel>
          <SelectItem value="GSC">National</SelectItem>
          <SelectItem value="NORCAL">Northern California</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
