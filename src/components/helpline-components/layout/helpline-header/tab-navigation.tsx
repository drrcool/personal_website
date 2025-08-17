"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import Calls from "../../pages/calls";
import Operators from "../../pages/operators";
import Reports from "../../pages/reports";
import Schedule from "../../pages/schedule";

const TABS = {
  Calls: "calls",
  Reports: "reports",
  Schedule: "schedule",
  Operators: "operators",
};

export const HelplineTabs = () => {
  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <Tabs defaultValue={TABS.Calls}>
        <TabsList className="bg-background">
          <TabsTrigger value={TABS.Calls}>Calls</TabsTrigger>
          <TabsTrigger value={TABS.Schedule}>Schedule</TabsTrigger>
          <TabsTrigger value={TABS.Operators}>Operators</TabsTrigger>
          <TabsTrigger value={TABS.Reports}>Reports</TabsTrigger>
        </TabsList>
        <TabsContent value={TABS.Calls}>
          <Calls />
        </TabsContent>
        <TabsContent value={TABS.Schedule}>
          <Schedule />
        </TabsContent>
        <TabsContent value={TABS.Operators}>
          <Operators />
        </TabsContent>
        <TabsContent value={TABS.Reports}>
          <Reports />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HelplineTabs;
