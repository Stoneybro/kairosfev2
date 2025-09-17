// src/types/index.ts
import { TASK_STATUS_MAP } from "@/utils/constants";

export type activeTabType =
  | "home"
  | "activity"
  | "settings"
  | "receive"
  | "deposit"
  | "send";

export type Tx = {
  transactionHash: string;
  from: string;
  to: string;
  value: string;
  timeStamp: string;
  input?: string;
  isError?: string;
  gasUsed?: string;
  gasPrice?: string;
};

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
  buddy?: `0x${string}` | undefined;
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


export type TabKey = keyof typeof TASK_STATUS_MAP;




