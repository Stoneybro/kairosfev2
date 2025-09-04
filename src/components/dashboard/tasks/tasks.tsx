"use client";

import { useQuery } from "@tanstack/react-query";
import { TaskType, statusMap } from "@/types";
import { Badge } from "@/components/ui/badge";
import { PiSpinner } from "react-icons/pi";
import { BiCoinStack } from "react-icons/bi";
import { IoCalendarOutline } from "react-icons/io5";
import { PiClockClockwiseLight } from "react-icons/pi";
import { BsSignpostSplit } from "react-icons/bs";
import { LuScanQrCode } from "react-icons/lu";
import { formatDate, formatNumber } from "@/utils/helpers";
import { formatEther } from "viem";
import { fetchTasks } from "@/utils/helpers";
import { Skeleton } from "@/components/ui/skeleton";

function Tasks({
  id,
  smartAccount,
}: {
  id: string;
  smartAccount: `0x${string}`;
}) {
  const { data, error, isLoading } = useQuery({
    queryKey: ["tasks", smartAccount],
    queryFn: () => fetchTasks(smartAccount),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
  });

  const taskData = data?.find((t: TaskType) => t.id.toString() === id);
  if (!taskData)
    return <div className='text-muted-foreground'>Task not found</div>;

  const status = statusMap[taskData.status] ?? {
    label: "unavailable",
    color: "red",
  };

  return (
    <div className='flex flex-col gap-6'>
      <div className='text-2xl'>{taskData?taskData.description:<Skeleton className="w-10 h-4" />}</div>
      <div className='flex flex-col justify-start items-start max-w-sm gap-4'>
        <div className='flex justify-between items-center w-full'>
          <span className='text-muted-foreground flex items-center gap-1'>
            <PiSpinner /> status
          </span>
          <Badge variant={"outline"}>{taskData?status.label:<Skeleton className="w-10 h-4" />}</Badge>
        </div>
        <div className='flex justify-between items-center w-full'>
          <span className='text-muted-foreground flex items-center gap-1'>
            <BiCoinStack /> reward
          </span>
          <span>{taskData?formatNumber(taskData.rewardAmount):<Skeleton className="w-10 h-4" />} ETH</span>
        </div>
        <div className='flex justify-between items-center w-full'>
          <span className='text-muted-foreground flex items-center gap-1'>
            <IoCalendarOutline /> deadline
          </span>
          <span>{taskData?formatDate(taskData.deadline):<Skeleton className="w-10 h-4" />}</span>
        </div>
        <div className='flex justify-between items-center w-full'>
          <span className='text-muted-foreground flex items-center gap-1'>
            <PiClockClockwiseLight /> time left
          </span>
          <span>Active</span>
        </div>
        <div className='flex justify-between items-center w-full'>
          <span className='text-muted-foreground flex items-center gap-1'>
            <BsSignpostSplit /> penalty choice
          </span>
          <span>Active</span>
        </div>
        <div className='flex justify-between items-center w-full'>
          <span className='text-muted-foreground flex items-center gap-1'>
            <LuScanQrCode /> verification method
          </span>
          <span>self</span>
        </div>
      </div>
    </div>
  );
}

export default Tasks;
