// lib/web3/hooks/useReadContract.ts
"use client";
import { useQuery } from "@tanstack/react-query";
import type { Abi } from "viem";
import { usePrivyAccount } from "./usePrivyAccount";
import { readContractServer } from "../server";

export function useReadContract<T = unknown>(p: {
  address: `0x${string}`;
  abi: Abi;
  functionName: string;
  args?: any[];
  chainIdOverride?: number;
  enabled?: boolean;
}) {

  const { chainId } = usePrivyAccount();
  const cid = p.chainIdOverride ?? chainId!;
  return useQuery({
    queryKey: ["readContract", cid, p.address, p.functionName, p.args],
    enabled: !!cid && (p.enabled ?? true),
    queryFn: () =>
      readContractServer<T>({
        address: p.address,
        abi: p.abi,
        functionName: p.functionName,
        args: p.args,
      }),
    refetchOnWindowFocus: false,
  });
}
