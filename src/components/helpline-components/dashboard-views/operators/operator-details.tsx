"use client";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { useState, useMemo } from "react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useOperatorStats } from "../../dataFetchers/useOperatorStats";

const OperatorDetails = () => {
  const [showFullDetails, setShowFullDetails] = useState(false);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const { data } = useOperatorStats();

  const sortedData = useMemo(() => {
    if (!data || !sortField) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortField as keyof typeof a];
      const bValue = b[sortField as keyof typeof b];

      // Handle numeric values
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      // Handle string values
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return 0;
    });
  }, [data, sortField, sortDirection]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) return <ArrowUpDown className="ml-2 h-4 w-4" />;
    return sortDirection === "asc" ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    );
  };
  return (
    <div className="flex flex-col gap-4">
      <Button
        variant="outline"
        className="w-[200px]"
        onClick={() => setShowFullDetails(!showFullDetails)}
      >
        Toggle Full Operator Details
      </Button>

      {showFullDetails && (
        <div className="p-12 flex flex-col gap-6 justify-center">
          <div className="flex flex-col gap-4 max-w-[1000px] mx-auto">
            <div className="text-primary text-lg font-bold">
              Note: We only have assigned call counts after May 1, 2025.
              Assigned call counts and missed call rates for periods that
              include times prior to this date may be inaccurate.
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    className="w-[100px] cursor-pointer hover:bg-muted"
                    onClick={() => handleSort("operator_name")}
                  >
                    <div className="flex items-center">
                      Operator
                      {getSortIcon("operator_name")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="text-center cursor-pointer hover:bg-muted"
                    onClick={() => handleSort("assigned_call")}
                  >
                    <div className="flex items-center justify-center">
                      Incoming Call Count
                      {getSortIcon("assigned_call")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="text-center cursor-pointer hover:bg-muted"
                    onClick={() => handleSort("connected_call_cnt")}
                  >
                    <div className="flex items-center justify-center">
                      Answered Call Count
                      {getSortIcon("connected_call_cnt")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="text-center cursor-pointer hover:bg-muted"
                    onClick={() => handleSort("missed_call_cnt")}
                  >
                    <div className="flex items-center justify-center">
                      Missed Call Count
                      {getSortIcon("missed_call_cnt")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="text-center cursor-pointer hover:bg-muted"
                    onClick={() => handleSort("missed_call_rate")}
                  >
                    <div className="flex items-center justify-center">
                      Missed Call Rate
                      {getSortIcon("missed_call_rate")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="text-center cursor-pointer hover:bg-muted"
                    onClick={() => handleSort("total_duration_secs")}
                  >
                    <div className="flex items-center justify-center">
                      Total Duration
                      {getSortIcon("total_duration_secs")}
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedData?.map((operator) => (
                  <TableRow key={operator.operator_name}>
                    <TableCell>{operator.operator_name}</TableCell>
                    <TableCell className="text-center">
                      {operator.assigned_call}
                    </TableCell>
                    <TableCell className="text-center">
                      {operator.connected_call_cnt}
                    </TableCell>
                    <TableCell className="text-center">
                      {operator.missed_call_cnt}
                    </TableCell>
                    <TableCell className="text-center">{`${operator.missed_call_rate.toFixed(0)}%`}</TableCell>
                    <TableCell className="text-center">
                      {operator.total_duration_secs}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
};

export default OperatorDetails;
