"use client";
import { HelplineToolsBar } from "../layout/helpline-tools-bar";

import OperatorDetails from "./operators/operator-details";
import OperatorFollowUpList from "./operators/operator-follow-up-list";
import OperatorStats from "./operators/operator-stats";
import OperatorSummaryRow from "./operators/operators-summary-row";

const Operators = () => {
  return (
    <div className="flex flex-col gap-5 p-5">
      <HelplineToolsBar title="Operator Metrics" />
      <OperatorSummaryRow />
      <OperatorFollowUpList />
      <OperatorStats />
      <OperatorDetails />
    </div>
  );
};

export default Operators;
