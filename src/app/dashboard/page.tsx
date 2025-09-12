//app/dashboard/page.tsx
import { Cards } from "@/components/dashboard/cards/cards";
import { TaskTableWrapper } from "@/components/dashboard/table/tableWrapper";
import { cookies } from "next/headers";
export async function getSmartAccountAddress() {
    const smartAccount = (await cookies()).get("smart_wallet")
    ?.value as `0x${string}`;
    return smartAccount
}
export default async function Page() {
  const smartAccount = await getSmartAccountAddress();
  return (
    <div className='flex flex-col gap-8'>
      <Cards smartAccount={smartAccount} />
      <TaskTableWrapper smartAccount={smartAccount} />
    </div>
  );
}
