"use client";

import { useQuery } from "@tanstack/react-query";
import { PENALTY_ENUM, TaskStatus, TaskType, VERIFICATION_ENUM } from "@/types";
import { Badge } from "@/components/ui/badge";
import { PiSpinner } from "react-icons/pi";
import { BiCaretLeft, BiCoinStack } from "react-icons/bi";
import { IoCalendarOutline } from "react-icons/io5";
import { PiClockClockwiseLight } from "react-icons/pi";
import { BsSignpostSplit } from "react-icons/bs";
import { LuScanQrCode } from "react-icons/lu";
import { MdOutlineDescription } from "react-icons/md";
import { SiStagetimer } from "react-icons/si";
import Taskskeleton from "./task-skeleton";
import {
  fetchTasksById,
  formatDate,
  formatNumber,
  formatTime,
  getTimeRemaining,
  parseSlug,
  truncateAddress,
} from "@/utils/helpers";

import LoaderButton from "@/components/ui/loaderButton";
import { useCompleteTask } from "@/hooks/useCompleteTask";
import { toast } from "sonner";
import { useCancelTask } from "@/hooks/useCancelTask";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import CopyText from "@/components/ui/copy";
import { useReleaseDelayedPayment } from "@/hooks/useReleaseDelayedPayment";
import Link from "next/link";

function Tasks({
  slug,

  smartAccount,
}: {
  slug: string;

  smartAccount: `0x${string}`;
}) {
  const router = useRouter();
  const parsed = useMemo(() => parseSlug(slug), [slug]);
  const {
    data: taskData,
    error,
    isLoading,
  } = useQuery<TaskType>({
    queryKey: ["taskById", smartAccount, parsed?.id],
    queryFn: () => fetchTasksById(smartAccount, parsed!.id),
    enabled: !!parsed && !!smartAccount,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
  });
  const completeTask = useCompleteTask(smartAccount, parsed?.id);
  const cancelTask = useCancelTask(smartAccount, parsed?.id);
  const releaseFunds = useReleaseDelayedPayment(smartAccount, parsed?.id);
  if (isLoading)
    return (
      <div>
        <Taskskeleton />
      </div>
    );
  if (error)
    return (
      <div className='flex h-full w-full text-lg justify-center items-center'>
        Error loading task
      </div>
    );
  if (!taskData)
    return (
      <div className='flex h-full w-full text-lg justify-center items-center'>
        No task found
      </div>
    );
    const timeRemaining=getTimeRemaining(taskData.deadline,taskData.delayDuration)
  async function handleComplete(id: string): Promise<boolean> {
    const payLoad = BigInt(id);
    try {
      await completeTask.mutateAsync(payLoad);
      toast.success("Task Completed Successfully");
      router.push("/dashboard");
      return true;
    } catch (error) {
      console.log("Error completing task:", error);
      toast.error("Task Completion Failed");
      return false;
    }
  }
  async function handleCancel(id: string) {
    const payLoad = BigInt(id);
    try {
      await cancelTask.mutateAsync(payLoad);
      toast.success("Task Canceled Successfully");
      router.push("/dashboard");
      return true;
    } catch (error) {
      console.log("Error canceling task:", error);
      toast.error("Task Cancelation Failed");
      return false;
    }
  }
  async function handleRelease(id: string) {
    const payLoad = BigInt(id);
    try {
      await releaseFunds.mutateAsync(payLoad);
      toast.success("Funds Released Successfully");
      router.push("/dashboard");
      return true;
    } catch (error) {
      console.log("Error releasing Funds:", error);
      toast.error("Funds Release Failed");
      return false;
    }
  }

  return (
    <div>
    <Link href={"/dashboard"} className="text-xs text-muted-foreground flex items-center mb-2"><BiCaretLeft /> back to Dashboard</Link>
      <div className='flex flex-col gap-6 h-full'>
      <div className='text-2xl'>{taskData.title}</div>
      <div className='flex flex-col justify-start items-start max-w-sm gap-4'>
        <div className='flex justify-between items-center w-full'>
          <span className='text-muted-foreground flex items-center gap-1'>
            <MdOutlineDescription /> description
          </span>
          <span className=' text-xs'>{taskData.description}</span>
        </div>
        <div className='flex justify-between items-center w-full'>
          <span className='text-muted-foreground flex items-center gap-1'>
            <PiSpinner /> status
          </span>
          <Badge variant={"outline"}>{TaskStatus[taskData.status]}</Badge>
        </div>
        <div className='flex justify-between items-center w-full'>
          <span className='text-muted-foreground flex items-center gap-1'>
            <BiCoinStack /> reward
          </span>
          <span>{formatNumber(taskData.rewardAmount)} ETH</span>
        </div>
        <div className='flex justify-between items-center w-full'>
          <span className='text-muted-foreground flex items-center gap-1'>
            <IoCalendarOutline /> deadline
          </span>
          <span>{formatDate(taskData.deadline)}</span>
        </div>
        <div className='flex justify-between items-center w-full'>
          <span className='text-muted-foreground flex items-center gap-1'>
            <BsSignpostSplit /> penalty choice
          </span>
          <span>{PENALTY_ENUM[taskData.choice]}</span>
        </div>
        {taskData.choice == 1 &&
          (taskData.status == 0 || taskData.status == 3) && (
            <div className="flex flex-col gap-4 w-full">
            <div className='flex justify-between items-center w-full'>
              <span className='text-muted-foreground flex items-center gap-1'>
                <PiClockClockwiseLight /> Delay duration
              </span>
              <span>{formatTime(Number(taskData.delayDuration))}</span>
            </div>
            <div className='flex justify-between items-center w-full'>
              <span className='text-muted-foreground flex items-center gap-1'>
                <SiStagetimer /> time remaining
              </span>
              <span>{timeRemaining}</span>
            </div>
            </div>
          )}
        {taskData.choice == 2 &&
          (taskData.status == 0 || taskData.status == 3) && (
            <div className='flex justify-between items-center w-full'>
              <span className='text-muted-foreground flex items-center gap-1'>
                <PiClockClockwiseLight /> partner address
              </span>
              <span>
                {truncateAddress(taskData.buddy as string)}{" "}
                <CopyText text={taskData.buddy as string} />
              </span>
            </div>
          )}

        <div className='flex justify-between items-center w-full'>
          <span className='text-muted-foreground flex items-center gap-1'>
            <LuScanQrCode /> verification method
          </span>
          <span>{VERIFICATION_ENUM[taskData.verificationMethod]}</span>
        </div>
      </div>
      {taskData.status == 0 && (
        <div className='flex justify-start gap-4 items-center max-w-sm'>
          <LoaderButton
            className=''
            idleText='Complete Task'
            loadingText='Completing...'
            successText='Task Completed!'
            timeoutMs={60000}
            executeAction={() => handleComplete(taskData.id.toString())}
          />
          <LoaderButton
            className=''
            idleText='Cancel Task'
            loadingText='Cancelling'
            successText='Task Canceled!'
            timeoutMs={60000}
            variant='secondary'
            executeAction={() => handleCancel(taskData.id.toString())}
          />
        </div>
      )}
      {taskData.status == 3 &&
        !taskData.delayedRewardReleased &&
        taskData.choice == 1 && (
          <div className='flex justify-start gap-4 items-center max-w-sm'>
            <LoaderButton
              className=''
              idleText='Release Funds'
              loadingText='Releasing Funds...'
              successText='Funds Released!'
              timeoutMs={60000}
              executeAction={() => handleRelease(taskData.id.toString())}
            />
          </div>
        )}
    </div></div>

  );
}

export default Tasks;
