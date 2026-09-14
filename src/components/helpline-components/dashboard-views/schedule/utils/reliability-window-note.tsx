"use client";

import { RELIABILITY_CUTOFF_LABEL } from "@/components/helpline-components/metrics/constants";
import { useHelplineStore } from "@/components/helpline-components/state/helpline-store";

/** The reliability cutoff as a YYYYMMDD integer's worth of days before today. */
const CUTOFF_DATEINT = Number(RELIABILITY_CUTOFF_LABEL.replace(/-/g, ""));

/**
 * States the window actually used for operator reliability whenever the selected lookback
 * reaches further back than the data supports.
 *
 * `assigned_operators` was not populated before the cutoff, so reliability silently uses a
 * shorter window than the selector implies. Need score consumes those rates, so leaving
 * the discrepancy unstated would let a coordinator read a grid that disagrees with the
 * control above it.
 */
export const ReliabilityWindowNote = () => {
  const { lastNDaysDateint } = useHelplineStore();
  if (lastNDaysDateint >= CUTOFF_DATEINT) return null;

  return (
    <p className="text-sm text-muted-foreground">
      Call volume uses the selected window. Operator reliability — and therefore
      need score — uses {RELIABILITY_CUTOFF_LABEL} onward, the date operator
      assignment began being recorded.
    </p>
  );
};
