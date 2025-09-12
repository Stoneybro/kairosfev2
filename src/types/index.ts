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


export type TaskType = {
  id: bigint;
  title: string;
  description: string;
  rewardAmount: bigint;
  deadline: bigint;
  valid: boolean;
  status: number;
  choice: number;
  delayDuration: bigint;
  buddyAddress?: `0x${string}` | undefined;
  delayedRewardReleased: boolean;
  verificationMethod: number;
};
export type TaskTableData = {
  slug:string;
  id: bigint;
  title: string;
  description: string;
  rewardAmount: string | bigint; 
  deadline: string | bigint; 
  status: number;
  choice: number;
};

export enum TaskStatus {
  ACTIVE = 0,
  COMPLETED = 1,
  CANCELED = 2,
  EXPIRED = 3,
}
export const TASK_STATUS_MAP = {
  "Active tasks": 0,
  "Completed tasks": 1,
  "Canceled tasks": 2,
  "Expired tasks": 3,
} as const;
export const SLUG_STATUS_MAP: Record<string, number> = {
  "active-tasks": 0,
  "completed-tasks": 1,
  "canceled-tasks": 2,
  "expired-tasks": 3,
};
export enum VERIFICATION_ENUM {
  "Manual" = 0,
  "Partner" = 1,
  "AI" = 2,
}
export enum PENALTY_ENUM {
  "Delay Payment" = 1,
  "Send to Partner" = 2,
}

export type TabKey = keyof typeof TASK_STATUS_MAP;
