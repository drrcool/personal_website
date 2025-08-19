import { create } from "zustand";

export type HelplineID = "GSC" | "NORCAL";
interface HelplineStateValues {
  helplineId: HelplineID;
  lastNDays: number;
}
const defaultState: HelplineStateValues = {
  helplineId: "GSC",
  lastNDays: 30,
};

interface HelplineState extends HelplineStateValues {
  setHelplineId: (helplineId: HelplineID) => void;
  setLastNDays: (lastNDays: number) => void;
}
export const useHelplineStore = create<HelplineState>((set) => ({
  ...defaultState,
  setHelplineId: (helplineId: HelplineID) => set({ helplineId }),
  setLastNDays: (lastNDays: number) => set({ lastNDays }),
}));
