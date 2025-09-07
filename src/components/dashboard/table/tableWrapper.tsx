//component/tableWrapper.tsx
"use client";
import { useQuery } from "@tanstack/react-query";
import Table from "./table";

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
  if (error) return <div><TableSkeleton error={true} /></div>;
  if (!data) return <div><TableSkeleton error={true} /></div>;

   return <Table rawData={data} />;

}
