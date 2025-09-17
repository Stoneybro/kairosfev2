import { useCallback, useEffect, useState } from "react";
import { toSmartAccount } from "viem/account-abstraction";
import { encodeFunctionData } from "viem";
import { ACCOUNT_FACTORY_ABI, ENTRYPOINT_ABI } from "./contracts/contracts";
import {
  useWallets,
  useSignMessage,
  useSignTypedData,
} from "@privy-io/react-auth";
import { CONTRACT_ADDRESSES } from "./contracts/contracts";
import { publicClient } from "./pimlico";
import type { SmartAccount } from "viem/account-abstraction";

export type CustomSmartAccount = SmartAccount;
// function for initializing and managing a custom Smart Account (ERC-4337 style)
export default function CustomSmartAccount() {
  const [customSmartAccount, setCustomSmartAccount] =
    useState<CustomSmartAccount | null>(null);
  const { wallets } = useWallets();
  const owner = wallets?.find((wallet) => wallet.walletClientType === "privy");
  const { signMessage: privySignMessage } = useSignMessage();
  const { signTypedData: privySignTypedData } = useSignTypedData();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Reset account state when owner changes
  useEffect(() => {
    setCustomSmartAccount(null);
    setError(null);
    setIsLoading(false);
  }, [owner?.address]);

  // ----------------- CONFIG -----------------
  const ENTRY_POINT_ADDR = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789"; // v0.6 entry point
  const ENTRY_POINT_VERSION = "0.6";

  // Predict smart account address (factory call)
  async function predictAddress(ownerAddress: `0x${string}`) {
    return publicClient.readContract({
      address: CONTRACT_ADDRESSES.ACCOUNT_FACTORY,
      abi: ACCOUNT_FACTORY_ABI,
      functionName: "getAddressForUser",
      args: [ownerAddress],
    }) as Promise<`0x${string}`>;
  }

  // Initialize custom smart account
  const initCustomAccount = useCallback(async () => {
    setError(null);

    if (!owner || !owner.address) {
      const err = new Error("Owner address is undefined. Ensure a valid wallet is connected.");
      setError(err);
      throw err;
    }

    if (customSmartAccount) return customSmartAccount;

    setIsLoading(true);
    try {
      const account = await toSmartAccount({
        client: publicClient,
        entryPoint: {
          address: ENTRY_POINT_ADDR,
          version: ENTRY_POINT_VERSION,
          abi: ENTRYPOINT_ABI,
        },
        // Minimal adapter for encoding/decoding calls
        async decodeCalls(data) {
          return [{ to: "0x0000000000000000000000000000000000000000", value: 0n, data }];
        },
        async encodeCalls(calls) {
          if (calls.length !== 1) throw new Error("minimal adapter supports 1 call");
          const [c] = calls;
          return c.data ?? "0x";
        },
        // Account factory + nonce helpers
        async getAddress() {
          return predictAddress(owner.address as `0x${string}`);
        },
        async getFactoryArgs() {
          return {
            factory: CONTRACT_ADDRESSES.ACCOUNT_FACTORY,
            factoryData: encodeFunctionData({
              abi: ACCOUNT_FACTORY_ABI,
              functionName: "createAccount",
              args: [owner.address as `0x${string}`],
            }),
          };
        },
        async getNonce() {
          const sender = await predictAddress(owner.address as `0x${string}`);
          return publicClient.readContract({
            address: ENTRY_POINT_ADDR,
            abi: ENTRYPOINT_ABI,
            functionName: "getNonce",
            args: [sender, 0n],
          }) as Promise<bigint>;
        },
        async getStubSignature() {
          return "0xfffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c" as `0x${string}`;
        },
        // Message + typedData signing (via Privy)
        async signMessage({ message }) {
          const msgStr = typeof message === "string" ? message : (message.raw as `0x${string}`);
          const { signature } = await privySignMessage({ message: msgStr });
          return signature as `0x${string}`;
        },
        async signTypedData(typedData) {
          const { signature } = await privySignTypedData({
            types: typedData.types as Record<string, Array<{ name: string; type: string }>>,
            primaryType: typedData.primaryType as string,
            domain: typedData.domain as {
              name?: string;
              version?: string;
              chainId?: number;
              verifyingContract?: string;
              salt?: ArrayBuffer;
            },
            message: typedData.message as Record<string, unknown>,
          });
          return signature as `0x${string}`;
        },
        // UserOperation signing for EntryPoint
        async signUserOperation(userOperation) {
          // Set safe defaults if missing
          if (!userOperation.verificationGasLimit || userOperation.verificationGasLimit === 0n) {
            userOperation.verificationGasLimit = 2_000_000n;
          }
          if (!userOperation.callGasLimit || userOperation.callGasLimit === 0n) {
            userOperation.callGasLimit = 500_000n;
          }
          if (!userOperation.preVerificationGas || userOperation.preVerificationGas === 0n) {
            userOperation.preVerificationGas = 20_000n;
          }

          // Build hash for signing
          const uoForHash = {
            sender: userOperation.sender as `0x${string}`,
            nonce: userOperation.nonce,
            initCode: userOperation.initCode ?? "0x",
            callData: userOperation.callData,
            callGasLimit: userOperation.callGasLimit!,
            verificationGasLimit: userOperation.verificationGasLimit!,
            preVerificationGas: userOperation.preVerificationGas!,
            maxFeePerGas: userOperation.maxFeePerGas!,
            maxPriorityFeePerGas: userOperation.maxPriorityFeePerGas!,
            paymasterAndData: userOperation.paymasterAndData ?? "0x",
            signature: "0x",
          } as const;

          // Get userOpHash from EntryPoint
          const userOpHash = await publicClient.readContract({
            address: ENTRY_POINT_ADDR,
            abi: ENTRYPOINT_ABI,
            functionName: "getUserOpHash",
            args: [uoForHash],
          });

          // EIP-712 signing domain
          const chainId = Number(await publicClient.getChainId());
          const domain = {
            name: "EntryPoint",
            version: "0.6",
            chainId,
            verifyingContract: ENTRY_POINT_ADDR,
          };
          const types = { UserOperation: [{ name: "userOpHash", type: "bytes32" }] };
          const message = { userOpHash };

          const { signature } = await privySignTypedData({
            domain,
            types,
            primaryType: "UserOperation",
            message,
          });

          return signature as `0x${string}`;
        },
      });
      setCustomSmartAccount(account);
      return account;
    } catch (err) {
      console.error("custom account error", err);
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [owner?.address, privySignMessage, privySignTypedData, customSmartAccount]);

  // Reset state manually if needed
  const resetCustomAccount = useCallback(() => {
    setCustomSmartAccount(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return { initCustomAccount, isLoading, error, resetCustomAccount };
}
