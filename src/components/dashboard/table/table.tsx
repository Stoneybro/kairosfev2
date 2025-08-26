"use client";
import React, { useState } from "react";
import { DataTable } from "./data-table";
import { columns } from "@/components/dashboard/table/column";
import TableNav from "./nav";
import Createtaskbutton from "../create-task-button";
import { TaskType } from "@/lib/types";
type dataType={
    data:TaskType []
}
function table({data}:dataType) {
  const [activeTab, setActiveTab] = useState("Active tasks");
  const mappedData=data.map((task)=>{
    return{
        id:task.id,
        title:task.description,
        rewardAmount:task.rewardAmount,
        deadline:task.deadline,
        status: task.status,
        choice:task.choice,
    }
  })
  return (
    <div className="flex flex-col gap-8">
      <div className='flex justify-between items-center'>
        <TableNav activeTab={activeTab} setActiveTab={setActiveTab} />
        <Createtaskbutton />
      </div>
      <DataTable columns={columns} data={mappedData} />
    </div>
  );
}

export default table;
