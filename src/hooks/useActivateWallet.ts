"use client";
import { useSmartAccount } from "@/lib/useSmartAccount";
import { toast } from "sonner";
import { usePrivy, useSignMessage, useWallets } from "@privy-io/react-auth";
import { publicClient } from "@/lib/pimlico";
import { ENTRYPOINT_ABI, SMART_ACCOUNT_ABI } from "@/lib/contracts";
import {
  encodeFunctionData,
  hashMessage,
  recoverAddress,
  recoverMessageAddress,
  hexToBytes,
  keccak256,
} from "viem";
import { normalizeAndCanonicalizeSignature } from "@/lib/helpers";

export function useActivateWallet() {
  const { initClient } = useSmartAccount();
  const { user } = usePrivy();
  const { wallets } = useWallets();
  const owner = wallets?.find((wallet) => wallet.walletClientType === "privy");
  async function handleActivateWallet() {
    try {
      const smartAccountClient = await initClient();
      console.log("smartAccountClient", smartAccountClient);
      if (!smartAccountClient) {
        throw new Error("Smart Account Client is not initialized");
      }
      const hash = await smartAccountClient.sendUserOperation({
        account: smartAccountClient.account,
        calls: [
          {
            to: owner?.address as `0x${string}`,
            data: "0x",
            value: 0n,
          },
        ],
      });
      await smartAccountClient.waitForUserOperationReceipt({ hash });
      toast.success("Wallet activated successfully");
      return true;
    } catch (error) {
      console.log("Error activating wallet", error);
      toast.error("Failed to activate wallet");
      return false;
    }
  }



  return handleActivateWallet;
}
