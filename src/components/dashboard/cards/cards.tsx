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
import { fetchTasksCount } from "@/utils/helpers";
import { fetchDashboardBalance } from "@/utils/helpers";

export function Cards({ smartAccount }: { smartAccount: `0x${string}` }) {
  const { data: cardData, isLoading: cardDataIsLoading } = useQuery({
    queryKey: ["dashboardBalance", smartAccount],
    queryFn: () => fetchDashboardBalance(smartAccount),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
  });
  const {
    data: taskCount,
    isLoading: taskCountLoading,
    error,
  } = useQuery({
    queryKey: ["taskCount", smartAccount],
    queryFn: () => fetchTasksCount(smartAccount),
    staleTime: Infinity,
  });

  if (cardDataIsLoading && taskCountLoading) {
    return <CardsSkeleton />;
  }
  const total = taskCount?.reduce((a: number, b: number) => a + b, 0) ?? 0;
  let performance = 0;
  if (total > 0) {
    const raw = (taskCount[0] / total) * 100;
    performance = parseFloat(raw.toFixed(2));
  }

  return (
    <div className='*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4  *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs  @xl/main:grid-cols-2 @5xl/main:grid-cols-4'>
      <Card className='@container/card' id='tour-balance-card'>
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
          <div className='line-clamp-1 flex gap-2 font-medium'>
            For tasks, and transfers
          </div>
        </CardFooter>
      </Card>

      <Card className='@container/card' id='tour-active-tasks-card'>
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
          <div className='line-clamp-1 flex gap-2 font-medium'>
            No active tasks
          </div>
        </CardFooter>
      </Card>
      <Card className='@container/card' id='tour-committed-funds-card'>
        <CardHeader>
          <CardDescription>Commited Funds</CardDescription>
          <CardTitle className='!text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
            {`${cardData?.commitedFunds} ETH`}
          </CardTitle>
          <CardAction>
            <MdLock size={35} />
          </CardAction>
        </CardHeader>
        <CardFooter className='flex-col items-start gap-1.5 text-sm'>
          <div className='line-clamp-1 flex gap-2 font-medium'>
            Locked in active tasks & penalties
          </div>
        </CardFooter>
      </Card>
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
          <div className='line-clamp-1 flex gap-2 font-medium'>
            Overall success rate
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
