// src/utils/helpers.ts
import { getBalance, readContract } from "@/hooks/native/server";
import {
  CONTRACT_ADDRESSES,
  KAIROSFAUCET_ABI,
  SMART_ACCOUNT_ABI,
} from "@/lib/contracts/contracts";
import { Tx } from "@/types";
import { formatNumber, toSerializable } from "./format";
import { BLOCKSCOUT_BASE } from "./constants";

/**
 * Fetches internal wallet activity from Blockscout.
 * Centralizes logic for pagination and API querying.
 * Returns an array of transactions or empty array if none found.
 */
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
    throw new Error(`Error fetching activity: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  if (data.status !== "1" && data.message !== "OK") {
    return data.message === "No transactions found" ? [] : [];
  }

  return Array.isArray(data.result) ? data.result : [];
}

/**
 * Determines the transaction type relative to a smart account.
 * Helps the UI display "Sent", "Received", "Deploy Contract", or "Recurring Buy".
 */
export function getTransactionType(
  tx: Tx,
  smartAccount: string
): { type: "Sent" | "Received" | "Deploy Contract" | "Recurring Buy"; isIncoming: boolean } {
  const smartAccountLower = smartAccount.toLowerCase();
  const isIncoming = tx.to?.toLowerCase() === smartAccountLower;
  const isOutgoing = tx.from?.toLowerCase() === smartAccountLower;

  if (!tx.to || tx.to === "0x0000000000000000000000000000000000000000") {
    return { type: "Deploy Contract", isIncoming: false };
  }

  if (tx.input && tx.input !== "0x" && tx.value !== "0") {
    return { type: "Recurring Buy", isIncoming: false };
  }

  if (isIncoming) return { type: "Received", isIncoming: true };
  if (isOutgoing) return { type: "Sent", isIncoming: false };

  // Fallback for internal transactions
  return { type: tx.value !== "0" ? "Received" : "Sent", isIncoming: tx.value !== "0" };
}

/**
 * Fetches balances relevant to the dashboard display:
 * - availableBalance: spendable funds
 * - committedFunds: locked rewards
 * - totalBalance: total ETH in smart account
 */
export async function fetchDashboardBalance(smartAccountAddress: `0x${string}`) {
  const [availableBalance, committedFunds] = await Promise.all([
    getBalance({ address: smartAccountAddress }),
    readContract({
      address: smartAccountAddress,
      abi: SMART_ACCOUNT_ABI,
      functionName: "s_totalCommittedReward",
    }),
  ]);

  return {
    availableBalance: formatNumber(availableBalance - (committedFunds as bigint)),
    committedFunds: formatNumber(committedFunds as bigint),
    totalBalance: formatNumber(availableBalance),
  };
}

/**
 * Fetches balances for a smart account and a user address.
 * Useful for comparing personal wallet vs shared smart account funds.
 */
export async function fetchUserBalance(
  smartAccount: `0x${string}`,
  userAddress: `0x${string}`
) {
  const [smartAccountBalance, userAddressBalance] = await Promise.all([
    getBalance({ address: smartAccount }),
    getBalance({ address: userAddress }),
  ]);

  return {
    smartAccountBalance: formatNumber(smartAccountBalance),
    userAddressBalance: formatNumber(userAddressBalance),
  };
}

/**
 * Fetches tasks for a given smart account by status with pagination.
 * Reverses array so newest tasks appear first.
 */
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

/** Fetches task counts grouped by status */
export async function fetchTasksCount(smartAccount: `0x${string}`) {
  const result = await readContract({
    address: smartAccount,
    abi: SMART_ACCOUNT_ABI,
    functionName: "getTaskCountsByStatus",
  });
  return toSerializable(result);
}

/** Fetches a single task by its ID */
export async function fetchTasksById(smartAccount: `0x${string}`, id: bigint) {
  const result = await readContract({
    address: smartAccount,
    abi: SMART_ACCOUNT_ABI,
    functionName: "getTask",
    args: [id],
  });
  return toSerializable(result);
}

/**
 * Checks if the faucet has already been claimed by the smart account.
 * Useful for conditionally enabling/disabling the claim button.
 */
export async function checkFaucetStatus(smartAccount: `0x${string}`) {
  const result = await readContract({
    address: CONTRACT_ADDRESSES.FAUCET,
    abi: KAIROSFAUCET_ABI,
    functionName: "checkClaimStatus",
    args: [smartAccount],
  });

  return toSerializable(result);
}
