"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

import { TaskType } from "@/types";
import { PENALTY_ENUM, TaskStatus, VERIFICATION_ENUM } from "@/utils/constants";
import { fetchTasksById } from "@/utils/helpers";
import {
  formatDate,
  formatNumber,
  formatTime,
  getTimeRemaining,
  parseSlug,
  truncateAddress,
} from "@/utils/format";

import { Badge } from "@/components/ui/badge";
import LoaderButton from "@/components/ui/loaderButton";
import CopyText from "@/components/ui/copy";

import Taskskeleton from "./task-skeleton";

import { useCompleteTask } from "@/hooks/useCompleteTask";
import { useCancelTask } from "@/hooks/useCancelTask";
import { useReleaseDelayedPayment } from "@/hooks/useReleaseDelayedPayment";

import { BiCaretLeft, BiCoinStack } from "react-icons/bi";
import { PiSpinner, PiClockClockwiseLight } from "react-icons/pi";
import { IoCalendarOutline } from "react-icons/io5";
import { BsSignpostSplit } from "react-icons/bs";
import { LuScanQrCode } from "react-icons/lu";
import { MdOutlineDescription } from "react-icons/md";
import { SiStagetimer } from "react-icons/si";

function Tasks({
  slug,
  smartAccount,
}: {
  slug: string;
  smartAccount: `0x${string}`;
}) {
  const router = useRouter();

  // Parse slug into ID
  const parsed = useMemo(() => parseSlug(slug), [slug]);

  // Fetch task by ID
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

  // Mutations
  const completeTask = useCompleteTask(smartAccount, parsed?.id);
  const cancelTask = useCancelTask(smartAccount, parsed?.id);
  const releaseFunds = useReleaseDelayedPayment(smartAccount, parsed?.id);

  if (isLoading) return <Taskskeleton />;
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

  const timeRemaining = getTimeRemaining(
    taskData.deadline,
    taskData.delayDuration
  );

  // Handlers
  async function handleComplete(id: string) {
    try {
      await completeTask.mutateAsync(BigInt(id));
      toast.success("Task Completed Successfully");
      router.push("/dashboard");
      return true;
    } catch (error) {
      console.error("Error completing task:", error);
      toast.error("Task Completion Failed");
      return false;
    }
  }

  async function handleCancel(id: string) {
    try {
      await cancelTask.mutateAsync(BigInt(id));
      toast.success("Task Canceled Successfully");
      router.push("/dashboard");
      return true;
    } catch (error) {
      console.error("Error canceling task:", error);
      toast.error("Task Cancelation Failed");
      return false;
    }
  }

  async function handleRelease(id: string) {
    try {
      await releaseFunds.mutateAsync(BigInt(id));
      toast.success("Funds Released Successfully");
      router.push("/dashboard");
      return true;
    } catch (error) {
      console.error("Error releasing funds:", error);
      toast.error("Funds Release Failed");
      return false;
    }
  }

  return (
    <div>
      <Link
        href='/dashboard'
        className='text-xs text-muted-foreground flex items-center mb-2'
      >
        <BiCaretLeft /> back to Dashboard
      </Link>

      <div className='flex flex-col gap-6 h-full'>
        <div className='text-2xl'>{taskData.title}</div>

        {/* Task details */}
        <div className='flex flex-col justify-start items-start max-w-sm gap-4'>
          <div className='flex justify-between items-center w-full'>
            <span className='text-muted-foreground flex items-center gap-1'>
              <MdOutlineDescription /> description
            </span>
          </div>
          <div className='bg-muted w-full px-3 py-2 rounded-lg'>
            <span className='text-xs'>{taskData.description}</span>
          </div>

          <div className='flex justify-between items-center w-full'>
            <span className='text-muted-foreground flex items-center gap-1'>
              <PiSpinner /> status
            </span>
            <Badge variant='outline'>{TaskStatus[taskData.status]}</Badge>
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

          {/* Delay Payment penalty */}
          {taskData.choice == 1 &&
            (taskData.status == 0 || taskData.status == 3) && (
              <div className='flex flex-col gap-4 w-full'>
                <div className='flex justify-between items-center w-full'>
                  <span className='text-muted-foreground flex items-center gap-1'>
                    <PiClockClockwiseLight /> Delay duration
                  </span>
                  <span>{formatTime(Number(taskData.delayDuration))}</span>
                </div>

                {taskData.status == 3 && !taskData.delayedRewardReleased && (
                  <div className='flex justify-between items-center w-full'>
                    <span className='text-muted-foreground flex items-center gap-1'>
                      <SiStagetimer /> time remaining
                    </span>
                    <span>{timeRemaining}</span>
                  </div>
                )}
              </div>
            )}

          {/* Send-to-partner penalty */}
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

        {/* Actions */}
        {taskData.status == 0 && (
          <div className='flex justify-start gap-4 items-center max-w-sm'>
            <LoaderButton
              idleText='Complete Task'
              loadingText='Completing...'
              successText='Task Completed!'
              timeoutMs={60000}
              executeAction={() => handleComplete(taskData.id.toString())}
            />
            <LoaderButton
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
                idleText='Release Funds'
                loadingText='Releasing Funds...'
                successText='Funds Released!'
                timeoutMs={60000}
                executeAction={() => handleRelease(taskData.id.toString())}
                disabled={timeRemaining != "Withdrawable"}
              />
            </div>
          )}
      </div>
    </div>
  );
}

export default Tasks;
