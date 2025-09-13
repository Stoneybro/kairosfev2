// lib/web3/hooks/useTransactionReceipt.ts
"use client";
import { useQuery } from "@tanstack/react-query";
import { usePrivyAccount } from "./usePrivyAccount";
import { waitForTransactionReceipt } from "./server";

export function useTransactionReceipt(hash?: `0x${string}`, { timeoutMs = 120_000 } = {}) {
  const { chainId } = usePrivyAccount();
  const cid = chainId ? Number(chainId) : undefined;
  return useQuery({
    queryKey: ["txReceipt", cid, hash],
    enabled: !!cid && !!hash,
    queryFn: () => waitForTransactionReceipt({ chainId: cid!, hash: hash!, timeoutMs }),
    refetchOnWindowFocus: false,
  });
}
