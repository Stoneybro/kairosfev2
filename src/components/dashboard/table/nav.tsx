"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { fetchTasksCount } from "@/utils/helpers";

type TableNavType = {
  activeTab: "Active tasks" | "Completed tasks" | "Canceled tasks" | "Expired tasks";
  setActiveTab: (tab: TableNavType["activeTab"]) => void;
  smartAccount: `0x${string}`;
};

export default function TableNav({ activeTab, setActiveTab, smartAccount }: TableNavType) {
  /**
   * Fetches the count of tasks for each status.
   * The API returns an array where each index corresponds to a specific task category:
   * [Active, Completed, Canceled, Expired]
   * Using `staleTime: Infinity` ensures we don't refetch unnecessarily.
   */
  const { data, isLoading } = useQuery({
    queryKey: ["taskCount", smartAccount],
    queryFn: () => fetchTasksCount(smartAccount),
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  const [activeTaskCount, completedTaskCount, canceledTaskCount, expiredTaskCount] = isLoading
    ? [0, 0, 0, 0]
    : data;

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => setActiveTab(value as TableNavType["activeTab"])}
      className="w-full flex flex-col gap-8"
    >
      <div className="flex items-center justify-between bg-muted/20">
        {/* Select dropdown for smaller screens */}
        <label htmlFor="view-selector" className="sr-only">
          View
        </label>
        <Select value={activeTab} onValueChange={setActiveTab}>
          <SelectTrigger className="flex w-fit @4xl/main:hidden" size="sm" id="view-selector">
            <SelectValue placeholder="Select a view" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Active tasks">Active tasks</SelectItem>
            <SelectItem value="Completed tasks">Completed tasks</SelectItem>
            <SelectItem value="Canceled tasks">Canceled tasks</SelectItem>
            <SelectItem value="Expired tasks">Expired tasks</SelectItem>
          </SelectContent>
        </Select>

        {/* Tab navigation for larger screens */}
        <TabsList className="hidden @4xl/main:flex bg-muted">
          <TabsTrigger value="Active tasks">
            Active tasks
            {activeTaskCount !== 0 && <Badge variant="secondary">{activeTaskCount}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="Completed tasks">
            Completed tasks
            {completedTaskCount !== 0 && <Badge variant="secondary">{completedTaskCount}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="Canceled tasks">
            Canceled tasks
            {canceledTaskCount !== 0 && <Badge variant="secondary">{canceledTaskCount}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="Expired tasks">
            Expired tasks
            {expiredTaskCount !== 0 && <Badge variant="secondary">{expiredTaskCount}</Badge>}
          </TabsTrigger>
        </TabsList>
      </div>
    </Tabs>
  );
}
