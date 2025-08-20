"use client"
//make sure the page is converted back to a server page
import React, { useState } from 'react'
import { Cards } from '@/components/dashboardComponents/cards'
import TableNav from '@/components/dashboardComponents/TableNav'
import { TaskTableData } from '@/lib/types'
import { DataTable } from '@/components/dashboardComponents/data-table';
import Createtaskbutton from '@/components/dashboardComponents/create-task-button';
import { columns } from '@/components/dashboardComponents/column';
function page() {
  const [activeTab, setActiveTab] = useState("Active tasks");

  const data: TaskTableData[] = [
  {
    id: 1n,
    title: "Write smart contract",
    rewardAmount: "0.1 ETH",
    deadline: "Sept 7, 2024",
    status: 0,
    choice: 1,
  },
  {
    id: 2n,
    title: "Deploy to Base Sepolia",
    rewardAmount:  "0.5 ETH",
    deadline:  "Sept 14, 2024",
    status: 1,
    choice: 2,
  },
  {
    id: 3n,
    title: "Write frontend integration",
    rewardAmount: "0.5 ETH",// 1.5 ETH
    deadline: "Sept 21, 2024", // Sept 21, 2024
    status: 2,
    choice: 1,
  },
  {
    id: 4n,
    title: "Set up Paymaster",
    rewardAmount: "0.001 ETH", // 0.75 ETH
    deadline:"Sept 28, 2024", // Sept 28, 2024
    status: 3,
    choice: 2,
  },
  {
    id: 5n,
    title: "Write unit tests",
    rewardAmount: "2.5 ETH", // 0.3 ETH
    deadline: "Oct 5, 2024", // 
    status: 0,
    choice: 1,
  },
];
const filteredData = React.useMemo(() => {
  switch (activeTab) {
    case "Active tasks":
      return data.filter(d => d.status === 0);
    case "Completed tasks":
      return data.filter(d => d.status === 1);
    case "Canceled tasks":
      return data.filter(d => d.status === 2);
    case "Expired tasks":
      return data.filter(d => d.status === 3);
    default:
      return data;
  }
}, [activeTab, data]);


  return (
    <div className='flex flex-col gap-8'>
      <Cards />
      <div className="flex justify-between items-center"><TableNav activeTab={activeTab} setActiveTab={setActiveTab}/><Createtaskbutton/></div>
      
      <DataTable columns={columns} data={filteredData} />
    </div>
  )
}

export default page