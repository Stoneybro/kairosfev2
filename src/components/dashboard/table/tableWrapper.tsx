//component/tableWrapper.tsx
"use client";
import { useQuery } from "@tanstack/react-query";
import Table from "./table";
import { readContract } from "@/hooks/web3/server";
import { SMART_ACCOUNT_ABI } from "@/lib/contracts/contracts";
import { toSerializable } from "@/utils/helpers";
import { TableSkeleton } from "./tableSkeleton";
import { fetchTasks } from "@/utils/helpers";

export function TaskTableWrapper({
  smartAccount,
}: {
  smartAccount: `0x${string}`;
}) {
  const { data, error, isLoading } = useQuery({
    queryKey: ["tasks",smartAccount],
    queryFn: () => fetchTasks(smartAccount),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
  });

  if (isLoading) return <div><TableSkeleton /></div>;
  if (error) return <div>Error loading tasks</div>;
  if (!data) return <div>No tasks found</div>;

   return <Table rawData={data} />;

}
