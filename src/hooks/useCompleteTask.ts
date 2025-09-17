"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { encodeFunctionData } from "viem";
import { SMART_ACCOUNT_ABI } from "@/lib/contracts/contracts";
import { useSmartAccountContext } from "@/lib/smartAccountProvider";

// Hook to mark a task as completed 
export function useCompleteTask(smartAccount: `0x${string}`, id: string) {
  const { getClient } = useSmartAccountContext();
  const qc = useQueryClient();

  return useMutation({
    // Send "completeTask" userOp
    mutationFn: async (payLoad: bigint) => {
      const client = await getClient();
      if (!client) throw new Error("Smart account not initialized");

      const callData = encodeFunctionData({
        abi: SMART_ACCOUNT_ABI,
        functionName: "completeTask",
        args: [payLoad],
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

    // Invalidate queries after success
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks", smartAccount] });
      qc.invalidateQueries({ queryKey: ["dashboardBalance", smartAccount] });
      qc.invalidateQueries({ queryKey: ["taskCount", smartAccount] });
      qc.invalidateQueries({ queryKey: ["taskById", smartAccount, id] });
      qc.invalidateQueries({ queryKey: ["wallet-activity", smartAccount] });
    },

    // Log errors
    onError: (err) => {
      console.log(err);
    },

    // Always refresh tasks
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["tasks", smartAccount] });
    },
  });
}
