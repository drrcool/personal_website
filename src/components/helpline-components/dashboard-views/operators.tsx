"use client";
import { HelplineToolsBar } from "../layout/helpline-tools-bar";

import OperatorStats from "./operators/operator-stats";
import OperatorSummaryRow from "./operators/operators-summary-row";

const Operators = () => {
  return (
    <div className="flex flex-col gap-5 p-5">
      <HelplineToolsBar title="Operator Metrics" />
      <OperatorSummaryRow />
      <OperatorStats />
    </div>
  );
};

export default Operators;
