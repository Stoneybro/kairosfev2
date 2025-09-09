// lib/web3/hooks/useWriteContract.ts
"use client";
import { useMutation } from "@tanstack/react-query";
import type { Abi } from "viem";
import { usePrivyAccount } from "./usePrivyAccount";
import { getPublicClient, getWalletClient } from "../client";

export function useWriteContract(p: { address: `0x${string}`; abi: Abi; functionName: string }) {
  const { wallet, address, chainId, ready } = usePrivyAccount();

  return useMutation({
    mutationFn: async (args: any[] = []) => {
      if (!ready) throw new Error("Wallet not ready");
      // ensure wallet is on the expected chain
      await wallet!.switchChain(chainId!);
      const provider = await wallet!.getEthereumProvider();
      const wc = await getWalletClient({ chainId: chainId!, address: address!, eip1193: provider });
      const pc = getPublicClient(chainId!);

      // simulate to build a request (safety)
      const { request } = await pc.simulateContract({
        address: p.address,
        abi: p.abi,
        functionName: p.functionName as any,
        account: address!,
        args,
      });

      // write using the wallet client (EIP-1193 transport)
      const hash = await wc.writeContract(request);
      return hash as `0x${string}`;
    },
  });
}
