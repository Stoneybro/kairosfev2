import React from "react";
import { getSmartAccountAddress } from "../../page";
import Tasks from "@/components/dashboard/tasks/tasks";
export default async function Page(props: { params: Promise<{ status: string; id: string }> }) {
  const { status, id } = await props.params; // <-- await here
  const smartAccount = await getSmartAccountAddress();

const TASK_ID_STATUS_MAP: Record<string, number> = {
    "active-tasks": 0,
    "completed-tasks": 1,
    "canceled-tasks": 2,
    "expired-tasks": 3,
  };
  return (
    <Tasks smartAccount={smartAccount} status={TASK_ID_STATUS_MAP[status]} id={id} />
  );
}
