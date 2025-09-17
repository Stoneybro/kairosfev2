"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { encodeFunctionData } from "viem";
import { SMART_ACCOUNT_ABI } from "@/lib/contracts/contracts";
import { useSmartAccountContext } from "@/lib/smartAccountProvider";

// Input shape for creating a task
type CreateTaskArgsType = {
  taskTitle: string;
  taskDescription: string;
  rewardAmount: bigint;
  deadlineInSeconds: bigint;
  penaltyChoice: number;
  verificationMethod: number;
  sendBuddy?: `0x${string}`;
  delayPayment?: bigint;
};

// Hook to create a new task 
export function useCreateTask(smartAccount: `0x${string}`) {
  const { getClient } = useSmartAccountContext();
  const qc = useQueryClient();

  return useMutation({
    // Send "createTask" userOp
    mutationFn: async (payLoad: CreateTaskArgsType) => {
      const client = await getClient();
      if (!client) throw new Error("Smart account not initialized");

      const callData = encodeFunctionData({
        abi: SMART_ACCOUNT_ABI,
        functionName: "createTask",
        args: [
          payLoad.taskTitle,
          payLoad.taskDescription,
          payLoad.rewardAmount,
          payLoad.deadlineInSeconds,
          payLoad.penaltyChoice,
          payLoad.delayPayment ?? 0n,
          payLoad.sendBuddy ?? "0x0000000000000000000000000000000000000000",
          payLoad.verificationMethod,
        ],
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

    // Refresh queries on success
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks", smartAccount] });
      qc.invalidateQueries({ queryKey: ["dashboardBalance", smartAccount] });
      qc.invalidateQueries({ queryKey: ["taskCount", smartAccount] });
      qc.invalidateQueries({ queryKey: ["wallet-activity", smartAccount] });
    },

    // Log errors
    onError: (err) => {
      console.log(err);
    },

    // Always re-fetch tasks
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["tasks", smartAccount] });
    },
  });
}
