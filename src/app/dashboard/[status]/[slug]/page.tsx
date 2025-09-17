import React from "react";
import { getSmartAccountAddress } from "../../page";
import Tasks from "@/components/dashboard/tasks/tasks";
import { parseSlug } from "@/utils/format";
import { notFound } from "next/navigation";

export default async function Page(props: { params: Promise<{ slug: string,status:string }> }) {
  const {slug } = await props.params; 
  const smartAccount = await getSmartAccountAddress();
  const parsed=parseSlug(slug)
  if (!parsed.id) {
    return notFound()
  }
  return (
    <Tasks smartAccount={smartAccount} slug={slug}  />
  );
}
