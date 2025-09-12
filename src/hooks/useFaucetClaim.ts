"use client";
import { useSmartAccount } from "@/lib/useSmartAccount";
import { useQueryClient } from "@tanstack/react-query";
import { encodeFunctionData } from "viem";
import { CONTRACT_ADDRESSES, KAIROSFAUCET_ABI, SMART_ACCOUNT_ABI } from "@/lib/contracts/contracts";
import { toast } from "sonner";

export default function useFaucetClaim(smartAccount: `0x${string}`) {
  const qc = useQueryClient();
  const { initClient } = useSmartAccount();


  async function faucetClaim() {
    try {
      const smartAccountClient = await initClient();
      if (!smartAccountClient) {
        throw new Error("Smart Account Client is not initialized");
      }
      const faucetCallData=encodeFunctionData({
        abi:KAIROSFAUCET_ABI,
        functionName:"claimETH"
      })
      const callData=encodeFunctionData({
        abi:SMART_ACCOUNT_ABI,
        functionName:"execute",
        args:[CONTRACT_ADDRESSES.FAUCET,0n,faucetCallData]
      })
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
       qc.invalidateQueries({ queryKey: ["tasks", smartAccount] });
      qc.invalidateQueries({ queryKey: ["dashboardBalance", smartAccount] });
      qc.invalidateQueries({ queryKey: ["taskCount",smartAccount] });
      return true;
    } catch (error) {
      console.log("Error claiming faucet", error);
      toast.error("Faucet claim failed. Try again.");
      return false;
    }
  }

  return  faucetClaim ;
}
