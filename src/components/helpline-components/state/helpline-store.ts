import { create } from "zustand";

export type HelplineID = "GSC" | "NORCAL";
interface HelplineStateValues {
  helplineId: HelplineID;
}
const defaultState: HelplineStateValues = {
  helplineId: "GSC",
};

interface HelplineState extends HelplineStateValues {
  setHelplineId: (helplineId: HelplineID) => void;
}
const useHelplineStore = create<HelplineState>((set) => ({
  ...defaultState,
  setHelplineId: (helplineId: HelplineID) => set({ helplineId }),
}));

export const useHelplineId = () => {
  const helplineId = useHelplineStore((state) => state.helplineId);
  const setHelplineId = useHelplineStore((state) => state.setHelplineId);
  return { helplineId, setHelplineId };
};
