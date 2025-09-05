"use client";
import { useSmartAccount } from "@/lib/useSmartAccount";
import { toast } from "sonner";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { encodeFunctionData } from "viem";
import {
  CONTRACT_ADDRESSES,
  ACCOUNT_FACTORY_ABI,
} from "../lib/contracts/contracts";
import { publicClient } from "@/lib/pimlico";

export function useActivateWallet() {
  const { initClient } = useSmartAccount();
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

  async function simulateCreateAccountAsEntryPoint() {
    const ENTRY_POINT_ADDR = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789"; // v0.6

    // build calldata the same way frontend builds it
    const calldata = encodeFunctionData({
      abi: ACCOUNT_FACTORY_ABI,
      functionName: "createAccount",
      args: [owner?.address as `0x${string}`],
    });

    try {
      const code = await publicClient.getCode({
        address: "0x09477210720fdcff0a449c0444525e155373b8a3",
      });
      console.log(
        code && code !== "0x" ? "Account deployed" : "Account not deployed"
      );

      // eth_call with from=entryPoint simulates exactly what EntryPoint does
      const res = await publicClient.call({
        to: CONTRACT_ADDRESSES.ACCOUNT_FACTORY,
        data: calldata,
        account: ENTRY_POINT_ADDR, // critical: simulate caller = EntryPoint
      });
      console.log("call returned (no revert):", res);
    } catch (err) {
      // viem surfaces error with revert reason when available
      console.error("call reverted. reason / data:", err);
      throw err;
    }
  }
  return simulateCreateAccountAsEntryPoint;
}
