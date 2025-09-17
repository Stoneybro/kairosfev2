"use client";

import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FaCoins } from "react-icons/fa";
import { IoIosListBox } from "react-icons/io";
import { MdLock } from "react-icons/md";
import { BiBullseye } from "react-icons/bi";
import { useQuery } from "@tanstack/react-query";
import { CardsSkeleton } from "./cardsSkeleton";
import { fetchTasksCount, fetchDashboardBalance } from "@/utils/helpers";

export function Cards({ smartAccount }: { smartAccount: `0x${string}` }) {
  /**
   * Dashboard balances: available balance and commited funds.
   */
  const { data: cardData, isLoading: cardDataIsLoading } = useQuery({
    queryKey: ["dashboardBalance", smartAccount],
    queryFn: () => fetchDashboardBalance(smartAccount),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
  });

  /**
   * Task counts: [Active, Completed, Canceled, Expired].
   * Used to calculate performance percentage and task stats.
   */
  const { data: taskCount, isLoading: taskCountLoading } = useQuery({
    queryKey: ["taskCount", smartAccount],
    queryFn: () => fetchTasksCount(smartAccount),
    staleTime: Infinity,
  });

  if (cardDataIsLoading && taskCountLoading) {
    return <CardsSkeleton />;
  }

  // Total tasks counts (default to 0 if no data yet)
  const total = taskCount?.reduce((a: number, b: any) => a + Number(b), 0) ?? 0;

  // Performance = % of completed tasks out of total
  const performance =
    total > 0
      ? parseFloat(((Number(taskCount[1]) / total) * 100).toFixed(2))
      : 0;

  return (
    <div
      id='tour-cards'
      className='grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4
                 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5
                 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card
                 *:data-[slot=card]:shadow-xs'
    >
      {/* Available balance */}
      <Card className='@container/card'>
        <CardHeader>
          <CardDescription>Available Balance</CardDescription>
          <CardTitle className='!text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
            {`${cardData?.availableBalance} ETH`}
          </CardTitle>
          <CardAction>
            <FaCoins size={35} />
          </CardAction>
        </CardHeader>
        <CardFooter className='flex-col items-start gap-1.5 text-sm'>
          <div className='font-medium'>For tasks and transfers</div>
        </CardFooter>
      </Card>

      {/* Active tasks */}
      <Card className='@container/card'>
        <CardHeader>
          <CardDescription>Active Tasks</CardDescription>
          <CardTitle className='!text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
            {taskCountLoading ? "0" : taskCount[0]}
          </CardTitle>
          <CardAction>
            <IoIosListBox size={35} />
          </CardAction>
        </CardHeader>
        <CardFooter className='flex-col items-start gap-1.5 text-sm'>
          <div className='font-medium'>No active tasks</div>
        </CardFooter>
      </Card>

      {/* Committed funds */}
      <Card className='@container/card'>
        <CardHeader>
          <CardDescription>Committed Funds</CardDescription>
          <CardTitle className='!text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
            {`${cardData?.committedFunds} ETH`}
          </CardTitle>
          <CardAction>
            <MdLock size={35} />
          </CardAction>
        </CardHeader>
        <CardFooter className='flex-col items-start gap-1.5 text-sm'>
          <div className='font-medium'>Locked in active tasks & penalties</div>
        </CardFooter>
      </Card>

      {/* Task performance */}
      <Card className='@container/card' id='tour-performance-card'>
        <CardHeader>
          <CardDescription>Task Performance</CardDescription>
          <CardTitle className='!text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
            {performance}%
          </CardTitle>
          <CardAction>
            <BiBullseye size={35} />
          </CardAction>
        </CardHeader>
        <CardFooter className='flex-col items-start gap-1.5 text-sm'>
          <div className='font-medium'>Overall success rate</div>
        </CardFooter>
      </Card>
    </div>
  );
}
