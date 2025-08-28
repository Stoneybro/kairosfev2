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

export async function fetchTasks(): Promise<TaskType[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/tasks`);
  if (!res.ok) throw new Error("failed to fetch tasks");
  return res.json();
}

function Tasks({ id }: { id: string }) {
  const { data, error, isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
  });

  if (isLoading) return <div>Loading tasks...</div>;
  if (error) return <div>Error loading tasks</div>;
  if (!data) return <div>No tasks found</div>;

  const taskData = data.find((t: TaskType) => t.id.toString() === id);
  if (!taskData)
    return <div className='text-muted-foreground'>Task not found</div>;

  const status = statusMap[taskData.status] ?? {
    label: "unavailable",
    color: "red",
  };

  return (
    <div className='flex flex-col gap-6'>
      <div className='text-2xl'>{taskData.description}</div>
      <div className='flex flex-col justify-start items-start max-w-sm gap-4'>
        <div className='flex justify-between items-center w-full'>
          <span className='text-muted-foreground flex items-center gap-1'>
            <PiSpinner /> status
          </span>
          <Badge variant={"outline"}>{status.label}</Badge>
        </div>
        <div className='flex justify-between items-center w-full'>
          <span className='text-muted-foreground flex items-center gap-1'>
            <BiCoinStack /> reward
          </span>
          <span>{taskData.rewardAmount}</span>
        </div>
        <div className='flex justify-between items-center w-full'>
          <span className='text-muted-foreground flex items-center gap-1'>
            <IoCalendarOutline /> deadline
          </span>
          <span>{taskData.deadline}</span>
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
