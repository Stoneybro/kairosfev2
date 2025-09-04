"use client";
import { useSmartAccount } from "@/lib/useSmartAccount";
import { toast } from "sonner";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { encodeFunctionData } from "viem";
import { SMART_ACCOUNT_ABI } from "@/lib/contracts/contracts";

type CreateTaskArgsType = {
  taskDescription: string;
  rewardAmount: bigint;
  deadlineInSeconds: bigint;
  penaltyChoice: number;
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
          payLoad.taskDescription,
          payLoad.rewardAmount,
          payLoad.deadlineInSeconds,
          payLoad.penaltyChoice,
          payLoad.sendBuddy ?? "0x0000000000000000000000000000000000000000",
          payLoad.delayPayment ?? 0n,
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
      toast.success("Task created");
      console.log(data);
    },
    onError: (err, payLoad, context: any) => {
      toast.error("Transaction failed");
      console.log(err);
    },
    onSettled: (_data, payLoad) => {
      qc.invalidateQueries({ queryKey: ["tasks", smartAccount] });
    },
  });
}
