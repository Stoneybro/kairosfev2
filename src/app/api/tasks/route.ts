//api/tas
import { NextResponse } from "next/server";
import { readContract } from "@/hooks/web3/server";
import { SMART_ACCOUNT_ABI } from "@/lib/contracts/contracts";
import { cookies } from "next/headers";
import { unstable_cache } from "next/cache";

function toSerializable(obj: any): any {
  if (typeof obj === "bigint") {
    return obj.toString();
  }
  if (Array.isArray(obj)) {
    return obj.map(toSerializable);
  }
  if (obj && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [k, toSerializable(v)])
    );
  }
  return obj;
}
const getTasks = (smartAccount: `0x${string}`) =>
  unstable_cache(
    async () => {
      const result = await readContract({
        address: smartAccount,
        abi: SMART_ACCOUNT_ABI,
        functionName: "getAllTasks",
        args: [],
      });
      return toSerializable(result);
    },
    ["tasks", smartAccount],
    { revalidate: false, tags: [`tasks-${smartAccount}`] }
  )();

export async function GET() {
  const smartAccount = (await cookies()).get("smart_wallet")?.value;

  if (!smartAccount) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const rawTasks = await getTasks(smartAccount as `0x${string}`);
  const tasks = toSerializable(rawTasks);
  return NextResponse.json(tasks);
}
