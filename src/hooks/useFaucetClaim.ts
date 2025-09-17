"use client";
import { useQueryClient } from "@tanstack/react-query";
import { encodeFunctionData } from "viem";
import { CONTRACT_ADDRESSES, KAIROSFAUCET_ABI, SMART_ACCOUNT_ABI } from "@/lib/contracts/contracts";
import { useSmartAccountContext } from "@/lib/smartAccountProvider";
import { toast } from "sonner";

// Hook for claiming faucet ETH 
export default function useFaucetClaim(smartAccount: `0x${string}`) {
  const qc = useQueryClient();
  const { getClient } = useSmartAccountContext();

  async function faucetClaim() {
    try {
      const smartAccountClient = await getClient();
      if (!smartAccountClient) throw new Error("Smart Account Client is not initialized");

      // Encode faucet "claimETH" call
      const faucetCallData = encodeFunctionData({
        abi: KAIROSFAUCET_ABI,
        functionName: "claimETH",
      });

      // Wrap faucet call in smart account "execute"
      const callData = encodeFunctionData({
        abi: SMART_ACCOUNT_ABI,
        functionName: "execute",
        args: [CONTRACT_ADDRESSES.FAUCET, 0n, faucetCallData],
      });

      // Send user operation
      const hash = await smartAccountClient.sendUserOperation({
        account: smartAccountClient.account,
        calls: [
          {
            to: smartAccount,
            data: callData,
            value: 0n,
          },
        ],
      });

      await smartAccountClient.waitForUserOperationReceipt({ hash });
      toast.success("Faucet claimed successfully!");

      // Refresh related queries
      qc.invalidateQueries({ queryKey: ["tasks", smartAccount] });
      qc.invalidateQueries({ queryKey: ["dashboardBalance", smartAccount] });
      qc.invalidateQueries({ queryKey: ["taskCount", smartAccount] });
      qc.invalidateQueries({ queryKey: ["wallet-activity", smartAccount] });

      return true;
    } catch (error) {
      console.log("Error claiming faucet", error);
      toast.error("Faucet claim failed. Try again.");
      return false;
    }
  }

  return faucetClaim;
}
