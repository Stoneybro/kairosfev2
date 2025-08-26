import type { Abi } from "viem";
import type { Log } from "viem";
import { getPublicClient } from "./client";

const publicClient = getPublicClient();
/**
 * Read-only contract call. Safe on server.
 */
export async function readContract<T = unknown>(params: {
  address: `0x${string}`;
  abi: Abi;
  functionName: string;
  args?: any[];
}): Promise<T> {
  return publicClient.readContract({
    address: params.address,
    abi: params.abi,
    functionName: params.functionName as any,
    args: params.args ?? [],
  }) as Promise<T>;
}

/**
 * Get an address balance. Safe on server.
 */
export async function getBalanceServer(params: { address: `0x${string}` }) {
  return publicClient.getBalance({ address: params.address });
}

/**
 * Get current block number or single fetch. Safe on server.
 */
export async function getBlockNumberServer() {
  return publicClient.getBlockNumber();
}

/**
 * Simulate a contract write to obtain a request object.
 * Useful server-side to estimate gas, validate args, or prepare payload.
 * Note: sending a state-changing tx server-side requires a signer or a signed tx.
 */
export async function simulateContractServer(params: {
  address: `0x${string}`;
  abi: Abi;
  functionName: string;
  account?: `0x${string}`; // optional for better simulation
  args?: any[];
}) {
  return publicClient.simulateContract({
    address: params.address,
    abi: params.abi,
    functionName: params.functionName as any,
    account: params.account,
    args: params.args ?? [],
  });
}

/**
 * Wait for a transaction receipt. Safe on server.
 */
export async function waitForTransactionReceiptServer(params: {
  chainId: number;
  hash: `0x${string}`;
  confirmations?: number;
  timeoutMs?: number;
}) {
  return publicClient.waitForTransactionReceipt({
    hash: params.hash,
    confirmations: params.confirmations ?? 1,
    timeout: params.timeoutMs ?? 120_000,
  });
}

/**
 * Server-side event watcher. Returns unsubscribe function.
 * Use only in long-running server processes (workers) or for on-demand short watchers.
 */
export function watchContractEventServer(params: {
  chainId: number;
  address: `0x${string}`;
  abi: Abi;
  eventName?: string;
  args?: Record<string, unknown>;
  onLogs: (logs: Log[]) => void;
  pollingInterval?: number;
}) {
  const unwatch = publicClient.watchContractEvent({
    address: params.address,
    abi: params.abi,
    eventName: params.eventName as any,
    args: params.args as any,
    onLogs: params.onLogs,
    pollingInterval: params.pollingInterval ?? 6_000,
    strict: false,
  });
  return unwatch;
}
