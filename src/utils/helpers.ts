import { getBalance, readContract } from "@/hooks/web3/server";
import { SMART_ACCOUNT_ABI } from "@/lib/contracts/contracts";
import { formatEther } from "viem";

export  function toSerializable(obj: any): any {
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

export function formatNumber(number:bigint) {
 return parseFloat(Number(formatEther(number)).toFixed(4)).toString()
}
export function truncateAddress(address: string, start = 6, end = 4) {
    if (!address) return "";
    return `${address.slice(0, start)}...${address.slice(-end)}`;
  }
  export function formatDate(date:bigint){
    return new Date(Number(date) * 1000).toLocaleString("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })
  }

export async function fetchDashboardBalance(smartAccountAddress: `0x${string}`) {
  const [availableBalance, commitedFunds] = await Promise.all([
    getBalance({ address: smartAccountAddress }),
    readContract({
      address: smartAccountAddress,
      abi: SMART_ACCOUNT_ABI,
      functionName: "s_totalCommittedReward",
    }),
  ]);
  return {
    availableBalance: formatNumber(availableBalance - (commitedFunds as bigint)),
    commitedFunds: formatNumber(commitedFunds as bigint),
    totalBalance: formatNumber(availableBalance)
  };
}
export async function fetchUserBalance(smartAccount:`0x${string}`,userAddress:`0x${string}`) {
  const[smartAccountbalance,userAddressBalance]=await Promise.all([
    getBalance({address:smartAccount}),
    getBalance({address:userAddress})
  ])
  return {
    smartAccountbalance:formatNumber(smartAccountbalance),
    userAddressBalance:formatNumber(userAddressBalance)
  }
}
export async function fetchTasks(smartAccount: `0x${string}`) {
  const result = await readContract({
    address: smartAccount,
    abi: SMART_ACCOUNT_ABI,
    functionName: "getTasksByStatus",
    args: [0,0,7],
  });
  const serializedResult = toSerializable(result);
  return serializedResult;
}
export async function fetchTasksCount(smartAccount: `0x${string}`) {
  const result = await readContract({
    address: smartAccount,
    abi: SMART_ACCOUNT_ABI,
    functionName: "getTasksCountByStatus",
  });
  return toSerializable(result);
}