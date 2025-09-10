// component/tableWrapper.tsx
"use client";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import TableNav from "./nav";
import { TableSkeleton } from "./tableSkeleton";
import { fetchTasks, formatDate, formatNumber } from "@/utils/helpers";
import Createtaskbutton from "../tasks/create-task-button";
import { DataTable } from "./data-table";
import { columns } from "./column";
import { TaskType } from "@/types";
import { TabKey } from "@/types";

export function TaskTableWrapper({
  smartAccount,
}: {
  smartAccount: `0x${string}` | undefined;
}) {
  const [page, setPage] = useState({
    pending: 1,
    completed: 1,
    canceled: 1,
    expired: 1,
  });
  const [activeTab, setActiveTab] = useState<TabKey>("Active tasks");
  const limit = 7;

  // Build one query per status
  const queries = {
    pending: useQuery({
      queryKey: ["tasks", smartAccount, "pending", page.pending],
      queryFn: () =>
        fetchTasks(
          smartAccount as `0x${string}`,
          0,
          (page.pending - 1) * limit,
          limit
        ),
      enabled: !!smartAccount,
      staleTime: Infinity,
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
        return queries.pending;
      case "Completed tasks":
        return queries.completed;
      case "Canceled tasks":
        return queries.canceled;
      case "Expired tasks":
        return queries.expired;
      default:
        return queries.pending;
    }
  }, [activeTab, queries]);

  if (!smartAccount) {
    return <TableSkeleton error />;
  }

  if (activeQuery.isLoading) {
    return <TableSkeleton />;
  }

  if (activeQuery.error) {
    return <TableSkeleton error />;
  }

  if (!activeQuery.data || activeQuery.data.length === 0) {
    return <TableSkeleton noData />;
  }

  return (
    <div className='flex flex-col gap-8'>
      <div className='flex justify-between items-center'>
        <TableNav
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          smartAccount={smartAccount}
        />
        <Createtaskbutton />
      </div>

      <DataTable
        columns={columns}
        data={(activeQuery.data as TaskType[]).map((task) => ({
          id: task.id,
          title: task.description,
          rewardAmount:`${formatNumber(task.rewardAmount)} ETH` ,
          deadline:formatDate(task.deadline),
          status: task.status,
          choice: task.choice,
        }))}
        page={page}
        setPage={setPage}
        activeTab={activeTab}
      />
    </div>
  );
}
