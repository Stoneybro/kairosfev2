//dashboard/[id]/page.tsx
import React from "react";
import { getSmartAccountAddress } from "../page";
import Tasks from "@/components/dashboard/tasks/tasks";
async function  page({ params }: { params: { id: string } }) {
const smartAccount=await getSmartAccountAddress();
return(
  <Tasks id={params.id} smartAccount={smartAccount} />
)
}

export default page;
