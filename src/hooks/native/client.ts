// lib/web3/clients.ts
import { createPublicClient, createWalletClient, http, custom } from "viem";
import { baseSepolia } from "viem/chains";



export const getPublicClient = () =>
  createPublicClient({ chain: baseSepolia, transport: http() });

export const getWalletClient = async ({
  address,
  eip1193,
}: {
  chainId: number;
  address: `0x${string}`;
  eip1193: any;
}) =>
  createWalletClient({
    account: address,
    chain: baseSepolia,
    transport: custom(eip1193),
  });
