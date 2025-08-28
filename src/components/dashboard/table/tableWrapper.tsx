//component/tableWrapper.tsx
"use client";
import { useQuery } from "@tanstack/react-query";
import Table from "./table";
import { readContract } from "@/hooks/web3/server";
import { SMART_ACCOUNT_ABI } from "@/lib/contracts/contracts";
import { toSerializable } from "@/utils/helpers";

export async function fetchTasks(smartAccount: `0x${string}`) {
  const result = await readContract({
    address: smartAccount,
    abi: SMART_ACCOUNT_ABI,
    functionName: "getAllTasks",
    args: [],
  });
  const serializedResult = toSerializable(result);
  return serializedResult;
}

export function TaskTableWrapper({
  smartAccount,
}: {
  smartAccount: `0x${string}`;
}) {
  if (!smartAccount) {
    return;
  }
  const { data, error, isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => fetchTasks(smartAccount),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
  });

  if (isLoading) return <div>Loading tasks...</div>;
  if (error) return <div>Error loading tasks</div>;
  if (!data) return <div>No tasks found</div>;

  return <Table rawData={data} />;
}
