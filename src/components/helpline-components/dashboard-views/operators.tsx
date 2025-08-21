"use client";
import { HelplineToolsBar } from "../layout/helpline-tools-bar";

import OperatorSummaryRow from "./operators/operators-summary-row";

const Operators = () => {
  return (
    <div className="flex flex-col gap-5 p-5">
      <HelplineToolsBar title="Operator Metrics" />
      <OperatorSummaryRow />
    </div>
  );
};

export default Operators;
