"use client";
import { toast } from "sonner";
import { useWallets } from "@privy-io/react-auth";
import { encodeFunctionData } from "viem";
import { SMART_ACCOUNT_ABI } from "@/lib/contracts/contracts";
import { useQueryClient } from "@tanstack/react-query";
import { useSmartAccountContext } from "@/lib/smartAccountProvider";
export function activateWallet() {
  const {getClient}=useSmartAccountContext();
  const { wallets } = useWallets();
  const owner = wallets?.find((wallet) => wallet.walletClientType === "privy");
  const queryClient = useQueryClient();
  async function handleActivateWallet() {
    try {
      const smartAccountClient = await getClient();
      console.log("smartAccountClient", smartAccountClient);
      if (!smartAccountClient) {
        throw new Error("Smart Account Client is not initialized");
      }
      const callData=encodeFunctionData({
        abi: SMART_ACCOUNT_ABI,
        functionName: "execute",
        args: [owner?.address as `0x${string}`,0n,"0x"],
      })
      const hash = await smartAccountClient.sendUserOperation({
        account: smartAccountClient.account,
        calls: [
          {
            to: owner?.address as `0x${string}`,
            data: callData,
            value: 0n,
          },
        ],
      });
      await smartAccountClient.waitForUserOperationReceipt({ hash });
      queryClient.invalidateQueries({ queryKey: ["sync-session",owner?.address] });
      toast.success("Wallet activated successfully");

      return true;
    } catch (error) {
      console.log("Error activating wallet", error);
      toast.error("Failed to activate wallet");
      return false;
    }
  }

  return  handleActivateWallet ;
}
