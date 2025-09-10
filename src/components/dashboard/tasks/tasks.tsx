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
import LoaderButton from "@/components/ui/loaderButton";
import { useCompleteTask } from "@/hooks/useCompleteTask";
import { toast } from "sonner";
import { useCancelTask } from "@/hooks/useCancelTask";

function Tasks({
  id,
  status,
  smartAccount,
}: {
  id: string;
  status: number;
  smartAccount: `0x${string}`;
}) {
  const { data, error, isLoading } = useQuery({
    queryKey: ["tasks", smartAccount],
    queryFn: () => fetchTasks(smartAccount, status, 0, 7),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
  });
  const completeTask = useCompleteTask(smartAccount);
  const cancelTask=useCancelTask(smartAccount)
  console.log(data);
  if (isLoading && !data) return <div className=''>Loading...</div>;
  const taskData = data?.find((t: TaskType) => t.id.toString() === id);

  const statusLabel = statusMap[taskData.status] ?? {
    label: "unavailable",
    color: "red",
  };
  async function handleComplete(id: string): Promise<boolean> {
    const payLoad = BigInt(id);
    try {
      completeTask.mutate(payLoad);
      await completeTask.mutateAsync(payLoad);
      toast.success("Task Completed Successfully")
      return true;
    } catch (error) {
      console.log(error);
      toast.error("Task Completion Failed");
      return false;
    }
  }
    async function handleCancel(id: string) {
    const payLoad = BigInt(id);
    try {
      cancelTask.mutate(payLoad);
      await cancelTask.mutateAsync(payLoad);
      toast.success("Task Canceled Successfully")
      return true
    } catch (error) {
      console.log(error)
      toast.error("Task Cancelation Failed")
      return false
    }
  }

  return (
    <div className='flex flex-col gap-6'>
      <div className='text-2xl'>
        {!isLoading ? taskData.description : <Skeleton className='w-10 h-4' />}
      </div>
      <div className='flex flex-col justify-start items-start max-w-sm gap-4'>
        <div className='flex justify-between items-center w-full'>
          <span className='text-muted-foreground flex items-center gap-1'>
            <PiSpinner /> status
          </span>
          <Badge variant={"outline"}>
            {!isLoading ? statusLabel.label : <Skeleton className='w-10 h-4' />}
          </Badge>
        </div>
        <div className='flex justify-between items-center w-full'>
          <span className='text-muted-foreground flex items-center gap-1'>
            <BiCoinStack /> reward
          </span>
          <span>
            {!isLoading ? (
              formatNumber(taskData.rewardAmount)
            ) : (
              <Skeleton className='w-10 h-4' />
            )}{" "}
            ETH
          </span>
        </div>
        <div className='flex justify-between items-center w-full'>
          <span className='text-muted-foreground flex items-center gap-1'>
            <IoCalendarOutline /> deadline
          </span>
          <span>
            {!isLoading ? (
              formatDate(taskData.deadline)
            ) : (
              <Skeleton className='w-10 h-4' />
            )}
          </span>
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
          <span>{taskData.choice}</span>
        </div>
        <div className='flex justify-between items-center w-full'>
          <span className='text-muted-foreground flex items-center gap-1'>
            <LuScanQrCode /> verification method
          </span>
          <span>{taskData.verificationMethod}</span>
        </div>
      </div>
      <div className='flex justify-between items-center max-w-sm'>
        <LoaderButton
        className=''
          idleText='Cancel Task'
          loadingText='Cancelling'
          successText='Task Canceled!'
          timeoutMs={60000}
            executeAction={async () => {
            let success = false;
              success = await handleCancel(taskData.id);
            return success;
          }}
        />
        <LoaderButton
        className=''
          idleText='Complete Task'
          loadingText='Completing...'
          successText='Task Completed!'
          timeoutMs={60000}
          executeAction={async () => {
            let success = false;
              success = await handleComplete(taskData.id);
            return success;
          }}/>
      </div>
    </div>
  );
}

export default Tasks;
