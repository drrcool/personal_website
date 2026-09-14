"use client";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { Fragment, useMemo, useState } from "react";

import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useOperatorEngagement } from "../../dataFetchers/useOperatorEngagement";
import { useOperatorScheduleSlots } from "../../dataFetchers/useOperatorScheduleSlots";
import { useWeeklyCallHistory } from "../../dataFetchers/useWeeklyCallHistory";
import { RELIABILITY_CUTOFF_LABEL } from "../../metrics/constants";
import {
  ENGAGEMENT_STATE_LABELS,
  ENGAGEMENT_STATE_ORDER,
  type EngagementState,
  type OperatorEngagement,
} from "../../metrics/operator-engagement";

import { OperatorScheduleSummary } from "./operator-schedule-summary";
import { OperatorWeeklyChart } from "./operator-weekly-chart";

/** Row divider is a hairline, not the default full-strength border — this is a dense list. */
const ROW_DIVIDER = "border-border/40";

/**
 * Covers all engagement states for type-safety, though `unscheduled` never reaches this
 * list in practice: `useOperatorEngagement` drops it before rendering, since an operator
 * off the phone tree needs no follow-up.
 */
const STATE_STYLES: Record<EngagementState, string> = {
  silent: "bg-[var(--color-semantic-failure)] text-background",
  unscheduled: "bg-[var(--color-semantic-failure)] text-background",
  slipping: "bg-[var(--color-semantic-warning)] text-background",
  no_opportunity: "bg-muted text-muted-foreground",
  healthy: "bg-[var(--color-semantic-success)] text-background",
};

const StateBadge = ({ state }: { state: EngagementState }) => (
  <span
    className={`inline-block rounded-full px-2 py-0.5 text-xs font-bold whitespace-nowrap ${STATE_STYLES[state]}`}
  >
    {ENGAGEMENT_STATE_LABELS[state]}
  </span>
);

const days = (value: number | undefined) =>
  value === undefined ? "never" : `${value}d`;

type SortField =
  | "state"
  | "operator_name"
  | "daysSinceLastAnswered"
  | "daysSinceLastOpportunity"
  | "answerRate"
  | "rang";

const COLUMNS: Array<{ field: SortField; label: string; hint?: string }> = [
  { field: "state", label: "Status" },
  { field: "operator_name", label: "Operator" },
  {
    field: "daysSinceLastAnswered",
    label: "Since answered",
    hint: "Days since they last picked up a call",
  },
  {
    field: "daysSinceLastOpportunity",
    label: "Since rung",
    hint: "Days since a call last rang them — whether silence means anything",
  },
  {
    field: "answerRate",
    label: "Answer rate",
    hint: "With the typical number of other operators also ringing",
  },
  {
    field: "rang",
    label: "Opportunities",
    hint: "How much evidence the status rests on",
  },
];

/** `undefined` (never) sorts as the most extreme value, since it is the worst case. */
const sortValue = (
  row: OperatorEngagement,
  field: SortField
): number | string => {
  switch (field) {
    case "state":
      return ENGAGEMENT_STATE_ORDER.indexOf(row.state);
    case "operator_name":
      return row.operator_name;
    case "daysSinceLastAnswered":
      return row.daysSinceLastAnswered ?? Number.MAX_SAFE_INTEGER;
    case "daysSinceLastOpportunity":
      return row.daysSinceLastOpportunity ?? Number.MAX_SAFE_INTEGER;
    case "answerRate":
      return row.answerRate;
    case "rang":
      return row.rang;
  }
};

const OperatorFollowUpList = () => {
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  // Only one operator's chart open at a time — expanding a second collapses the first,
  // rather than letting the list grow one chart per click.
  const [expandedOperator, setExpandedOperator] = useState<string | null>(null);
  const { data, isLoading } = useOperatorEngagement();
  // Fetched once and shared across every expanded row's chart, rather than re-querying
  // per operator.
  const { data: weeklyCalls, isLoading: weeklyCallsLoading } =
    useWeeklyCallHistory();
  const { data: scheduleRows, isLoading: scheduleLoading } =
    useOperatorScheduleSlots();

  const toggleExpanded = (operatorName: string) => {
    setExpandedOperator((prev) =>
      prev === operatorName ? null : operatorName
    );
  };

  const sortedData = useMemo(() => {
    if (!data || !sortField) return data;
    return [...data].sort((a, b) => {
      const aValue = sortValue(a, sortField);
      const bValue = sortValue(b, sortField);
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }
      return sortDirection === "asc"
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });
  }, [data, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="ml-2 h-4 w-4" />;
    return sortDirection === "asc" ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    );
  };

  if (isLoading) {
    return (
      <Card className="p-4 border-0">
        <div className="text-muted-foreground">Loading operator activity…</div>
      </Card>
    );
  }

  return (
    <Card className="p-4 flex flex-col gap-3 border-0">
      <div>
        <div className="font-bold text-xl text-card-foreground">Follow Up</div>
        <p className="text-sm text-muted-foreground">
          Operators grouped by whether they have actually had the chance to
          answer, so disengagement is separable from a quiet shift. Activity is
          measured from {RELIABILITY_CUTOFF_LABEL}, when operator assignment
          began being recorded.
        </p>
      </div>
      <Table>
        <TableHeader>
          <TableRow className={ROW_DIVIDER}>
            {COLUMNS.map(({ field, label, hint }) => (
              <TableHead key={field}>
                <button
                  type="button"
                  onClick={() => handleSort(field)}
                  title={hint}
                  className="flex items-center font-bold cursor-pointer"
                >
                  {label}
                  {getSortIcon(field)}
                </button>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData?.map((row) => {
            const isExpanded = expandedOperator === row.operator_name;
            return (
              <Fragment key={row.operator_name}>
                <TableRow
                  className={`${ROW_DIVIDER} cursor-pointer`}
                  onClick={() => toggleExpanded(row.operator_name)}
                  aria-expanded={isExpanded}
                >
                  <TableCell>
                    <StateBadge state={row.state} />
                  </TableCell>
                  <TableCell className="font-bold">
                    <span className="flex items-center gap-1">
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                      )}
                      {row.operator_name}
                    </span>
                  </TableCell>
                  <TableCell>{days(row.daysSinceLastAnswered)}</TableCell>
                  <TableCell>{days(row.daysSinceLastOpportunity)}</TableCell>
                  <TableCell>
                    {row.rang === 0 ? (
                      <span className="text-muted-foreground">
                        no calls yet
                      </span>
                    ) : (
                      <>
                        {(100 * row.answerRate).toFixed(0)}%
                        <span className="text-muted-foreground text-xs">
                          {" "}
                          with {row.meanOtherOperators.toFixed(1)} others
                          ringing
                        </span>
                      </>
                    )}
                  </TableCell>
                  <TableCell>{row.rang}</TableCell>
                </TableRow>
                {isExpanded && (
                  <TableRow className={`${ROW_DIVIDER} hover:bg-transparent`}>
                    <TableCell colSpan={COLUMNS.length} className="bg-muted/20">
                      <div className="flex flex-col gap-3 py-1">
                        <div>
                          <div className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1.5">
                            Scheduled
                          </div>
                          {scheduleLoading || !scheduleRows ? (
                            <div className="text-sm text-muted-foreground">
                              Loading schedule…
                            </div>
                          ) : (
                            <OperatorScheduleSummary
                              scheduleRows={scheduleRows}
                              operatorName={row.operator_name}
                            />
                          )}
                        </div>
                        {weeklyCallsLoading || !weeklyCalls ? (
                          <div className="text-sm text-muted-foreground">
                            Loading weekly activity…
                          </div>
                        ) : (
                          <OperatorWeeklyChart
                            calls={weeklyCalls}
                            operatorName={row.operator_name}
                          />
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );
};

export default OperatorFollowUpList;
