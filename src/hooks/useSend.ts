"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { encodeFunctionData } from "viem";
import { SMART_ACCOUNT_ABI } from "@/lib/contracts/contracts";
import { useSmartAccountContext } from "@/lib/smartAccountProvider";

type SendArgsType = {
  address: `0x${string}`;
  amount: bigint;
};

// Hook for sending ETH from the smart account
export function useSend(smartAccount: `0x${string}`) {
  const { getClient } = useSmartAccountContext();
  const qc = useQueryClient();

  return useMutation({
    // Send userOp to transfer ETH
    mutationFn: async (payLoad: SendArgsType) => {
      const client = await getClient();
      if (!client) throw new Error("Smart account not initialized");

      const callData = encodeFunctionData({
        abi: SMART_ACCOUNT_ABI,
        functionName: "execute",
        args: [payLoad.address, payLoad.amount, "0x"],
      });

      const hash = await client.sendUserOperation({
        account: client.account,
        calls: [
          {
            to: smartAccount,
            data: callData,
            value: 0n,
          },
        ],
      });

      const receipt = await client.waitForUserOperationReceipt({ hash });
      return { hash, receipt };
    },

    // Invalidate relevant queries after success
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks", smartAccount] });
      qc.invalidateQueries({ queryKey: ["dashboardBalance", smartAccount] });
      qc.invalidateQueries({ queryKey: ["taskCount", smartAccount] });
      qc.invalidateQueries({ queryKey: ["wallet-activity", smartAccount] });
    },

    // Log errors (replace with toast if needed)
    onError: (err) => {
      console.log(err);
    },

    // Always revalidate task list
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["tasks", smartAccount] });
    },
  });
}
