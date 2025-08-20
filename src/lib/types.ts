// types/deployment.ts
export type DeploymentState = {
  accountStep: "idle" | "creating" | "created" | "error";
  accountError?: string;
};
export enum PenaltyType {
  DELAY_PAYMENT = "DELAY_PAYMENT",
  SEND_BUDDY = "SEND_BUDDY",
}
export type activeTabType =
  | "home"
  | "activity"
  | "settings"
  | "receive"
  | "deposit"
  | "send";

export const statusMap: Record<number, { label: string; color: string }> = {
  0: { label: "active", color: "text-blue-500" },
  1: { label: "completed", color: "text-green-500" },
  2: { label: "canceled", color: "text-black" },
  3: { label: "expired", color: "text-red-500" },
};
export type TaskType = {
  id: bigint;
  description: string;
  rewardAmount: bigint;
  deadline: bigint;
  valid: boolean;
  status: number;
  choice: number;
  delayDuration: bigint;
  buddyAddress?: `0x${string}` | undefined;
  delayedRewardReleased: boolean;
};
export type TaskTableData = {
  id: bigint;
  title: string;
  rewardAmount: string | bigint; // Use string for large numbers
  deadline: string | bigint; // Use string for large numbers
  status: number;
  choice: number;
};

export enum TaskStatus {
  ACTIVE = 0,
  COMPLETED = 1,
  CANCELED = 2,
  EXPIRED = 3,
}
