//component/table.tsx
"use client";
import React, { useState } from "react";
import { DataTable } from "./data-table";
import { columns } from "@/components/dashboard/table/column";
import TableNav from "./nav";
import Createtaskbutton from "../tasks/create-task-button";
import { TaskTableData, TaskType } from "@/types";
import { formatEther } from "viem";
type dataType = {
  rawData: TaskType[];
};
function table({ rawData }: dataType) {
  const [activeTab, setActiveTab] = useState("Active tasks");
  const tableData: TaskTableData[] = rawData?.map((task) => ({
    id: task.id,
    title: task.description,
    rewardAmount: `${formatEther(task.rewardAmount)} ETH`,
    deadline: new Date(Number(task.deadline) * 1000).toLocaleString("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }),
    status: task.status,
    choice: task.choice,
  }));
  return (
    <div className='flex flex-col gap-8'>
      <div className='flex justify-between items-center'>
        <TableNav activeTab={activeTab} setActiveTab={setActiveTab} />
        <Createtaskbutton />
      </div>
      <DataTable columns={columns} data={tableData} />
    </div>
  );
}
export default table;
