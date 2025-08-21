import { useState, useEffect, use } from "react";
import { toSmartAccount } from "viem/account-abstraction";
import { encodeFunctionData, hashMessage, toHex } from "viem";
import {
  SMART_ACCOUNT_ABI,
  ACCOUNT_FACTORY_ABI,
  ENTRYPOINT_ABI,
} from "./contracts";
import {
  useWallets,
  useSignMessage,
  useSignTypedData,
} from "@privy-io/react-auth";
import { CONTRACT_ADDRESSES } from "./contracts";
import { publicClient } from "./pimlico";
import { SmartAccount } from "viem/account-abstraction";
import { normalizeSignature } from "./helpers";

export type CustomSmartAccount = SmartAccount;

export default function useCustomSmartAccount() {
  const [customSmartAccount, setCustomSmartAccount] =
    useState<CustomSmartAccount | null>(null);
  const { wallets } = useWallets();
  const owner = wallets[0];

  const { signMessage: privySignMessage } = useSignMessage();
  const { signTypedData: privySignTypedData } = useSignTypedData();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // ----------------- CONFIG -----------------
  const ENTRY_POINT_ADDR = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789"; // v0.6
  const ENTRY_POINT_VERSION = "0.6";
  const USER_NONCE = 0n; //  each address is allowed only one deployment

  // Compute deterministic address via factory helper
  async function predictAddress(ownerAddress: `0x${string}`) {
    return publicClient.readContract({
      address: CONTRACT_ADDRESSES.ACCOUNT_FACTORY,
      abi: ACCOUNT_FACTORY_ABI,
      functionName: "getAddressForUser",
      args: [ownerAddress, USER_NONCE],
    }) as Promise<`0x${string}`>;
  }

  const initCustomAccount = async () => {
    if (!owner || !owner.address) {
      setError(
        new Error(
          "Owner address is undefined. Ensure a valid wallet is connected."
        )
      );
      return;
    }

    if (customSmartAccount) {
      console.log(
        "Custom Smart Account already initialized",
        customSmartAccount.address
      );
      return customSmartAccount;
    }
    setIsLoading(true);
    const provider = await owner?.getEthereumProvider();
    try {
      const account = await toSmartAccount({
        client: publicClient,
        entryPoint: {
          address: ENTRY_POINT_ADDR,
          version: ENTRY_POINT_VERSION,
          abi: ENTRYPOINT_ABI,
        },
        async decodeCalls(data) {
          return [
            {
              to: "0x0000000000000000000000000000000000000000",
              value: 0n,
              data,
            },
          ];
        },
        async encodeCalls(calls) {
          if (calls.length !== 1)
            throw new Error("minimal adapter supports 1 call");
          const [c] = calls;
          return encodeFunctionData({
            abi: SMART_ACCOUNT_ABI,
            functionName: "execute",
            args: [c.to as `0x${string}`, c.value ?? 0n, c.data ?? "0x"],
          });
        },
        async getAddress() {
          return predictAddress(
            owner.address as `0x${string}`
          ) as Promise<`0x${string}`>;
        },
        async getFactoryArgs() {
          return {
            factory: CONTRACT_ADDRESSES.ACCOUNT_FACTORY,
            factoryData: encodeFunctionData({
              abi: ACCOUNT_FACTORY_ABI,
              functionName: "createAccount",
              args: [USER_NONCE],
            }),
          };
        },
        async getNonce() {
          const sender = await predictAddress(owner.address as `0x${string}`);
          return publicClient.readContract({
            address: ENTRY_POINT_ADDR,
            abi: ENTRYPOINT_ABI,
            functionName: "getNonce",
            args: [sender, 0n], // key = 0
          }) as Promise<bigint>;
        },
        async getStubSignature() {
          return toHex(new Uint8Array(65));
        },
        async signMessage({ message }) {
          const msgStr =
            typeof message === "string"
              ? message
              : (message.raw as `0x${string}`);

          const { signature } = await privySignMessage({ message: msgStr });
          return signature as `0x${string}`;
        },
        async signTypedData(typedData) {
          const { signature } = await privySignTypedData({
            types: typedData.types as Record<
              string,
              Array<{ name: string; type: string }>
            >,
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
        async signUserOperation(userOperation) {
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
            signature: "0x", // ignored in hash but required by ABI
          } as const;
          const userOpHash = await publicClient.readContract({
            address: ENTRY_POINT_ADDR,
            abi: ENTRYPOINT_ABI,
            functionName: "getUserOpHash",
            args: [uoForHash],
          });
          const ethSigned = hashMessage(userOpHash as `0x${string}`);
          let signature = await provider?.request({
            method: "personal_sign",
            params: [ethSigned,owner.address],
          });

          console.log("signature from provider:", signature);
          const normalizedSignature = normalizeSignature(signature);
          console.log("normalizedSignature:", normalizedSignature);
          return normalizedSignature as `0x${string}`;
        },
      });
      setCustomSmartAccount(account);
      return account;
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return { initCustomAccount, isLoading, error };
}
