"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { encodeFunctionData } from "viem";
import { SMART_ACCOUNT_ABI } from "@/lib/contracts/contracts";
import { useSmartAccountContext } from "@/lib/smartAccountProvider";

// Hook for releasing a delayed payment from an expired task
export function useReleaseDelayedPayment(
  smartAccount: `0x${string}`,
  id: string
) {
  const { getClient } = useSmartAccountContext();
  const qc = useQueryClient();

  return useMutation({
    // Send userOp to release delayed payment
    mutationFn: async (payLoad: bigint) => {
      const client = await getClient();
      if (!client) throw new Error("Smart account not initialized");

      const callData = encodeFunctionData({
        abi: SMART_ACCOUNT_ABI,
        functionName: "releaseDelayedPayment",
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

    // Update cached queries after success
    onSuccess: (_data, _payLoad) => {
      qc.invalidateQueries({ queryKey: ["tasks", smartAccount] });
      qc.invalidateQueries({ queryKey: ["dashboardBalance", smartAccount] });
      qc.invalidateQueries({ queryKey: ["taskCount", smartAccount] });
      qc.invalidateQueries({ queryKey: ["taskById", smartAccount, id] });
      qc.invalidateQueries({ queryKey: ["wallet-activity", smartAccount] });
    },

    // Log errors (can extend later with toasts)
    onError: (err) => {
      console.log(err);
    },

    // Always revalidate tasks after mutation
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["tasks", smartAccount] });
    },
  });
}
