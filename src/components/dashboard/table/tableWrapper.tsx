// component/tableWrapper.tsx
"use client";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import TableNav from "./nav";
import { TableSkeleton } from "./tableSkeleton";
import {
  fetchTasks,
  fetchTasksCount,
  formatDate,
  formatNumber,
  slugify,
} from "@/utils/helpers";
import Createtaskbutton from "../tasks/create-task-button";
import { DataTable } from "./data-table";
import { columns } from "./column";
import { TASK_STATUS_MAP, TaskType } from "@/types";
import { TabKey } from "@/types";

export function TaskTableWrapper({
  smartAccount,
}: {
  smartAccount: `0x${string}` | undefined;
}) {
  const [page, setPage] = useState({
    active: 1,
    completed: 1,
    canceled: 1,
    expired: 1,
  });
  const [activeTab, setActiveTab] = useState<TabKey>("Active tasks");
  const limit = 7;
  const {
    data: taskCount,
    isLoading: taskCountIsLoading,
    error: taskCountError,
  } = useQuery({
    queryKey: ["taskCount", smartAccount],
    queryFn: () => fetchTasksCount(smartAccount as `0x${string}`),
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });
  // Build one query per status
  const queries = {
    active: useQuery({
      queryKey: ["tasks", smartAccount, "active", page.active],
      queryFn: () =>
        fetchTasks(
          smartAccount as `0x${string}`,
          0,
          (page.active - 1) * limit,
          limit
        ),
      enabled: !!smartAccount,
      staleTime: Infinity,
      refetchOnWindowFocus: false,
    }),
    completed: useQuery({
      queryKey: ["tasks", smartAccount, "completed", page.completed],
      queryFn: () =>
        fetchTasks(
          smartAccount as `0x${string}`,
          1,
          (page.completed - 1) * limit,
          limit
        ),
      enabled: !!smartAccount,
      staleTime: Infinity,
    }),
    canceled: useQuery({
      queryKey: ["tasks", smartAccount, "canceled", page.canceled],
      queryFn: () =>
        fetchTasks(
          smartAccount as `0x${string}`,
          2,
          (page.canceled - 1) * limit,
          limit
        ),
      enabled: !!smartAccount,
      staleTime: Infinity,
    }),
    expired: useQuery({
      queryKey: ["tasks", smartAccount, "expired", page.expired],
      queryFn: () =>
        fetchTasks(
          smartAccount as `0x${string}`,
          3,
          (page.expired - 1) * limit,
          limit
        ),
      enabled: !!smartAccount,
      staleTime: Infinity,
    }),
  };

  // Pick which dataset/error/loading state to show based on active tab
  const activeQuery = useMemo(() => {
    switch (activeTab) {
      case "Active tasks":
        return queries.active;
      case "Completed tasks":
        return queries.completed;
      case "Canceled tasks":
        return queries.canceled;
      case "Expired tasks":
        return queries.expired;
      default:
        return queries.active;
    }
  }, [activeTab, queries]);

  if (!smartAccount) {
    return <TableSkeleton error />;
  }

  if (activeQuery.isLoading && taskCountIsLoading) {
    return <TableSkeleton />;
  }

  if (activeQuery.error && taskCountError) {
    return <TableSkeleton error />;
  }

  const task = activeQuery.data;
  const statusCount = taskCount?.[TASK_STATUS_MAP[activeTab]] ?? 0;

  return (
    <div className='flex flex-col gap-8' id="tour-tasks">
      <div className='flex justify-between items-center'>
        <TableNav
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          smartAccount={smartAccount}
        />
        <Createtaskbutton />
      </div>

      {!task || task.length === 0 ? (
        <TableSkeleton noData />
      ) : (
        <DataTable
          columns={columns}
          data={(task as TaskType[]).map((task) => ({
            slug: slugify(task.description) + "-" + task.id,
            id: task.id,
            title: task.title,
            description: task.description,
            rewardAmount: `${formatNumber(task.rewardAmount)} ETH`,
            deadline: formatDate(task.deadline),
            status: task.status,
            choice: task.choice,
          }))}
          page={page}
          setPage={setPage}
          activeTab={activeTab}
          statusCount={statusCount}
          itemsPerPage={limit}
        />
      )}
    </div>
  );
}
