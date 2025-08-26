import { Cards } from "@/components/dashboard/cards";
import Table from "@/components/dashboard/table/table";
import { readContract } from "@/hooks/web3/server";
import { cookies } from "next/headers";
import { SMART_ACCOUNT_ABI } from "@/lib/contracts";
import { TaskType } from "@/lib/types";
import { formatEther } from "viem";
async function page() {
  const smartAccountAddress = (await cookies()).get("smart_wallet")?.value;
  const data = (await readContract({
    address: smartAccountAddress as `0x${string}`,
    abi: SMART_ACCOUNT_ABI,
    functionName: "getAllTasks",
    args: [],
  })) as TaskType[];
  const mappedData = data.map((task) => {
    const rewardAmount = formatEther(task.rewardAmount);
    const date = new Date(Number(task.deadline) * 1000).toUTCString();

    return {
      id: task.id,
      title: task.description,
      rewardAmount,
      deadline: date,
      status: task.status,
      choice: task.choice,
    };
  });

  return (
    <div className='flex flex-col gap-8'>
      <Cards />
      <Table data={data as TaskType[]} />
    </div>
  );
}

export default page;
