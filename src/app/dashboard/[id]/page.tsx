import React from "react";
import { notFound } from "next/navigation";
import { TaskTableData } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { statusMap } from "@/lib/types";
import { PiSpinner } from "react-icons/pi";
import { BiCoinStack } from "react-icons/bi";
import { IoCalendarOutline } from "react-icons/io5";
import { PiClockClockwiseLight } from "react-icons/pi";
import { BsSignpostSplit } from "react-icons/bs";
import { LuScanQrCode } from "react-icons/lu";


function page({ params }: { params: { id: string } }) {
  const data: TaskTableData[] = [
    {
      id: 0n,
      title: "Write smart contract",
      rewardAmount: "0.1 ETH",
      deadline: "Sept 7, 2024",
      status: 0,
      choice: 1,
    },
    {
      id: 1n,
      title: "Deploy to Base Sepolia",
      rewardAmount: "0.5 ETH",
      deadline: "Sept 14, 2024",
      status: 1,
      choice: 2,
    },
    {
      id: 2n,
      title: "Write frontend integration",
      rewardAmount: "0.5 ETH", // 1.5 ETH
      deadline: "Sept 21, 2024", // Sept 21, 2024
      status: 2,
      choice: 1,
    },
    {
      id: 3n,
      title: "Set up Paymaster",
      rewardAmount: "0.001 ETH", // 0.75 ETH
      deadline: "Sept 28, 2024", // Sept 28, 2024
      status: 3,
      choice: 2,
    },
    {
      id: 4n,
      title: "Write unit tests",
      rewardAmount: "2.5 ETH", // 0.3 ETH
      deadline: "Oct 5, 2024", //
      status: 0,
      choice: 1,
    },
  ];

  const taskData = data.find((data) =>  params.id === data.id.toString());
  if (!taskData) {
    return notFound();
  }
  const status = statusMap[taskData.status]??{label:"unavailable",color:"red"};

  return (
    <div className="flex flex-col gap-6">
      <div className='text-2xl'>{taskData?.title}</div>
      <div className='flex flex-col justify-start items-start max-w-sm gap-4'>
        <div className='flex justify-between items-center w-full'>
          <span className='text-muted-foreground flex items-center gap-1'><PiSpinner /> status</span>
          <Badge variant={"outline"}>{status.label}</Badge>
        </div>
        <div className='flex justify-between items-center w-full'>
          <span className=' text-muted-foreground flex items-center gap-1'><BiCoinStack />reward</span>
          <span className=''>{taskData?.rewardAmount}</span>
        </div>
        <div className='flex justify-between items-center w-full'>
          <span className='text-muted-foreground flex items-center gap-1'><IoCalendarOutline />deadline</span>
          <span className=''>{taskData?.deadline}</span>
        </div>
        <div className='flex justify-between items-center w-full'>
          <span className='text-muted-foreground flex items-center gap-1'><PiClockClockwiseLight />time left</span>
          <span className=''>Active</span>
        </div>
        <div className='flex justify-between items-center w-full'>
          <span className='text-muted-foreground flex items-center gap-1'><BsSignpostSplit />penalty choice</span>
          <span className=''>Active</span>
        </div>
        <div className='flex justify-between items-center w-full'>
          <span className='text-muted-foreground flex items-center gap-1'> <LuScanQrCode />verification method</span>
          <span className=''>self</span>
        </div>

       

      </div>
       <div className='flex flex-col items-start justify-center gap-2 bg-muted p-4 rounded-lg max-w-xl w-full'>
          <span className=' text-lg font-semibold'>Task Description</span>
          <span className=' text-accent-foreground text-sm'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Animi blanditiis nemo dolores placeat! Quo modi inventore fugit neque recusandae exercitationem!</span>
        </div>
    </div>
  );
}

export default page;
