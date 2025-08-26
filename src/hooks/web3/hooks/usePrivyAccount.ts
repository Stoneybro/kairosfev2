// lib/web3/hooks/usePrivyAccount.ts
"use client";
import { useWallets } from "@privy-io/react-auth";

export function usePrivyAccount() {
  const { wallets } = useWallets();
  const wallet = wallets?.[0];
  const address = wallet?.address as `0x${string}` | undefined;
  const chainId = wallet?.chainId;
  return { wallet, address, chainId, ready: !!wallet && !!address && !!chainId };
}
