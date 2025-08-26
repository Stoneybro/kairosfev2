// lib/web3/clients.ts
import { createPublicClient, createWalletClient, http, custom } from "viem";
import { mainnet, sepolia, polygon, arbitrum, base,baseSepolia } from "viem/chains";


/**
 * 
 * @dev For simplicity, we're only using the Base Sepolia testnet in this example.
 * You can uncomment and configure other chains as needed.
 */

// export const CHAINS = {
//   [mainnet.id]: mainnet,
//   [sepolia.id]: sepolia,
//   [polygon.id]: polygon,
//   [arbitrum.id]: arbitrum,
//   [base.id]: base,
//   [baseSepolia.id]: baseSepolia,
// };

// const RPC: Record<number, string> = {
//   [mainnet.id]: process.env.NEXT_PUBLIC_RPC_MAINNET!,
//   [sepolia.id]: process.env.NEXT_PUBLIC_RPC_SEPOLIA!,
//   [polygon.id]: process.env.NEXT_PUBLIC_RPC_POLYGON!,
//   [arbitrum.id]: process.env.NEXT_PUBLIC_RPC_ARBITRUM!,
//   [base.id]: process.env.NEXT_PUBLIC_RPC_BASE!,
//   [baseSepolia.id]: process.env.NEXT_PUBLIC_RPC_BASE_SEPOLIA!,
// };

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
