
"use client";
import { useQuery } from "@tanstack/react-query";
import { usePrivyAccount } from "./usePrivyAccount";
import { getBalanceServer } from "../server";

export function useBalance(addr?: `0x${string}`) {
  const { address, chainId } = usePrivyAccount();
  const a = addr ?? address!;
  const cid = chainId!;
  return useQuery({
    queryKey: ["balance", cid, a],
    enabled: !!a && !!cid,
    queryFn: () => getBalanceServer({ address: a }),
    refetchInterval: 15_000,
  });
}
