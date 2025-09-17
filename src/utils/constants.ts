//src/utils/constants.ts
export const TOUR_TARGETS = {
  DASHBOARD_CARDS:"#tour-cards",
  DASHBOARD_TASKS:"#tour-tasks",
  WALLET_SIDEBAR: "#tour-wallet-sidebar",
  CLAIM_FAUCET: "#tour-claim-faucet",
  SEND_RECEIVE_BTN: "#tour-send-receive-btn",
  SETTINGS:"#tour-settings",
  WALLET_ACTIVITY:"#tour-wallet-activity",
  CLAIM_FAUCET_BTN:"#tour-claim-faucet-btn",
};
export const BLOCKSCOUT_BASE = "https://base-sepolia.blockscout.com/api";

export enum PenaltyType {
  DELAY_PAYMENT = "DELAY_PAYMENT",
  SEND_BUDDY = "SEND_BUDDY",
}

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
