import { getBalance, readContract } from "@/hooks/native/server";
import {
  CONTRACT_ADDRESSES,
  KAIROSFAUCET_ABI,
  SMART_ACCOUNT_ABI,
} from "@/lib/contracts/contracts";
import { Tx } from "@/types";
import { formatEther } from "viem";

export function toSerializable(obj: any): any {
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

export function formatNumber(number: bigint) {
  return parseFloat(Number(formatEther(number)).toFixed(4)).toString();
}
export function truncateAddress(address: string, start = 6, end = 4) {
  if (!address) return "";
  return `${address.slice(0, start)}...${address.slice(-end)}`;
}
export function formatDate(date: bigint) {
  return new Date(Number(date) * 1000).toLocaleString("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
const toMillis = (v: number | string | bigint | undefined) => {
  if (v === undefined || v === null) return 0;
  const n = typeof v === "bigint" ? Number(v) : Number(v);
  // if already ms ( > 1e12 ) treat as ms, otherwise seconds -> ms
  return n > 1e12 ? n : n * 1000;
};
export function getTimeRemaining(deadline: number | string | bigint | undefined,delay: number | string | bigint | undefined) {
  const deadlineMs = toMillis(deadline);
  const delayMs = toMillis(delay);
  const end = deadlineMs + delayMs;
  const now = Date.now();
  const remaining = end - now;
  const timeRemaining=formatTime(Math.floor(remaining / 1000));
  return remaining > 0 ? timeRemaining : "Withdrawable";
}
export function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}
export function parseSlug(slug: string) {
  if (!slug) return null;

  const parts = slug.split("-");
  const rawId = parts.pop(); // last piece is id
  try {
    return toSerializable({ id: BigInt(rawId!) });
  } catch {
    return null;
  }
}
export function formatTime(seconds: number): string {
  const days = Math.floor(seconds / 86400); // 24 * 3600
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  const parts: string[] = [];
  if (days > 0) parts.push(`${days} day${days > 1 ? "s" : ""}`);
  if (hours > 0) parts.push(`${hours} hr${hours > 1 ? "s" : ""}`);
  if (minutes > 0) parts.push(`${minutes} min${minutes > 1 ? "s" : ""}`);

  return parts.join(" ") || "0 min";
}

const BLOCKSCOUT_BASE = "https://base-sepolia.blockscout.com/api";

export async function fetchWalletActivity({
  pageParam = 1,
  smartAccount,
}: {
  pageParam?: number;
  smartAccount: `0x${string}`;
}) {

    const url = new URL(BLOCKSCOUT_BASE);
    url.searchParams.set("module", "account");
    url.searchParams.set("action", "txlistinternal");
    url.searchParams.set("address", smartAccount);
    url.searchParams.set("page", String(pageParam));
    url.searchParams.set("offset", "15");
    url.searchParams.set("sort", "desc");
    url.searchParams.set("apikey", process.env.NEXT_PUBLIC_BASESCOUT_API_KEY!);

    const res = await fetch(url.toString());
    if (!res.ok) {
      throw new Error(
        `Error fetching activity: ${res.status} ${res.statusText}`
      );
    }

    const data = await res.json();
    if (data.status !== "1" && data.message !== "OK") {
      if (data.message === "No transactions found") {
        return [];
      }
      return [];
    }
    console.log(Array.isArray(data.result) ? data.result : []);

    return Array.isArray(data.result) ? data.result : [];
  };

export function getTransactionType(
  tx: Tx,
  smartAccount: string
): {
  type: "Sent" | "Received" | "Deploy Contract" | "Recurring Buy";
  isIncoming: boolean;
} {
  const smartAccountLower = smartAccount.toLowerCase();
  const isIncoming = tx.to && tx.to.toLowerCase() === smartAccountLower;
  const isOutgoing = tx.from && tx.from.toLowerCase() === smartAccountLower;

  // Contract deployment
  if (!tx.to || tx.to === "0x0000000000000000000000000000000000000000") {
    return { type: "Deploy Contract", isIncoming: false };
  }

  // Contract interaction with ETH value (like DEX swaps)
  if (tx.input && tx.input !== "0x" && tx.value !== "0") {
    return { type: "Recurring Buy", isIncoming: false };
  }

  // For AA wallets, we need to be more careful about determining direction
  // Internal transactions might have different patterns
  if (isIncoming) {
    return { type: "Received", isIncoming: true };
  } else if (isOutgoing) {
    return { type: "Sent", isIncoming: false };
  } else {
    // For internal transactions, check if value is going to the smart account
    return {
      type: tx.value !== "0" ? "Received" : "Sent",
      isIncoming: tx.value !== "0",
    };
  }
}

export async function fetchDashboardBalance(
  smartAccountAddress: `0x${string}`
) {
  const [availableBalance, commitedFunds] = await Promise.all([
    getBalance({ address: smartAccountAddress }),
    readContract({
      address: smartAccountAddress,
      abi: SMART_ACCOUNT_ABI,
      functionName: "s_totalCommittedReward",
    }),
  ]);
  return {
    availableBalance: formatNumber(
      availableBalance - (commitedFunds as bigint)
    ),
    commitedFunds: formatNumber(commitedFunds as bigint),
    totalBalance: formatNumber(availableBalance),
  };
}
export async function fetchUserBalance(
  smartAccount: `0x${string}`,
  userAddress: `0x${string}`
) {
  const [smartAccountbalance, userAddressBalance] = await Promise.all([
    getBalance({ address: smartAccount }),
    getBalance({ address: userAddress }),
  ]);
  return {
    smartAccountbalance: formatNumber(smartAccountbalance),
    userAddressBalance: formatNumber(userAddressBalance),
  };
}
export async function fetchTasks(
  smartAccount: `0x${string}`,
  status: number,
  start: number,
  limit: number
) {
  const result = await readContract({
    address: smartAccount,
    abi: SMART_ACCOUNT_ABI,
    functionName: "getTasksByStatus",
    args: [status, start, limit],
  });
  const serializedResult = toSerializable(result);
   return Array.isArray(serializedResult) ? serializedResult.reverse() : serializedResult;
}
export async function fetchTasksCount(smartAccount: `0x${string}`) {
  const result = await readContract({
    address: smartAccount,
    abi: SMART_ACCOUNT_ABI,
    functionName: "getTaskCountsByStatus",
  });
  return toSerializable(result);
}
export async function fetchTasksById(smartAccount: `0x${string}`, id: bigint) {
  const result = await readContract({
    address: smartAccount,
    abi: SMART_ACCOUNT_ABI,
    functionName: "getTask",
    args: [id],
  });
  return toSerializable(result);
}

export async function checkFaucetStatus(smartAccount: `0x${string}`) {
  const result = await readContract({
    address: CONTRACT_ADDRESSES.FAUCET,
    abi: KAIROSFAUCET_ABI,
    functionName: "checkClaimStatus",
    args: [smartAccount],
  });
  return toSerializable(result);
}
