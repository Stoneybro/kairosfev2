"use client";
import { useSmartAccount } from "@/lib/useSmartAccount";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { encodeFunctionData } from "viem";
import { SMART_ACCOUNT_ABI } from "@/lib/contracts/contracts";

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

export function useCreateTask(smartAccount: `0x${string}`) {
  const { initClient } = useSmartAccount();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payLoad: CreateTaskArgsType) => {
      const client = await initClient();
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
    onSuccess: (data, payLoad) => {
      qc.invalidateQueries({ queryKey: ["tasks", smartAccount] });
      qc.invalidateQueries({ queryKey: ["dashboardBalance", smartAccount] });
      qc.invalidateQueries({ queryKey: ["taskCount",smartAccount] });
      
    },
    onError: (err, payLoad, context: any) => {
      console.log(err);
    },
    onSettled: (_data, payLoad) => {
      qc.invalidateQueries({ queryKey: ["tasks", smartAccount] });
    },
  });
}
