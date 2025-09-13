// components/IntroTour.tsx
"use client";

import { useEffect } from "react";
import { driver } from "driver.js";
import { TOUR_TARGETS } from "@/utils/constants";
import "driver.js/dist/driver.css";

let tour: ReturnType<typeof driver> | null = null;

function initTour() {
  if (!tour) {
    tour = driver({
      showProgress: true,
      steps: [
        {
          popover: {
            title: "Welcome to Kairos",
            description:
              "This demo showcases what I’ve built so far. If you have suggestions or feedback, please reach out on Twitter at @z__stone. Thank you for testing and helping improve Kairos.",
          },
        },

        {
          element: TOUR_TARGETS.BALANCE_CARD,
          popover: {
            title: "Available Balance",
            description:
              "Your wallet balance available for tasks and transfers.",
            side: "bottom",
          },
        },
        {
          element: TOUR_TARGETS.ACTIVE_TASKS_CARD,
          popover: {
            title: "Active Tasks",
            description: "Shows how many tasks are currently in progress.",
            side: "bottom",
          },
        },
        {
          element: TOUR_TARGETS.COMMITTED_FUNDS_CARD,
          popover: {
            title: "Committed Funds",
            description: "Tracks funds locked in active tasks or penalties.",
            side: "bottom",
          },
        },
        {
          element: TOUR_TARGETS.PERFORMANCE_CARD,
          popover: {
            title: "Task Performance",
            description:
              "Your overall success rate across all completed tasks.",
            side: "bottom",
          },
        },
        {
          element: TOUR_TARGETS.CREATE_TASK_BTN,
          popover: {
            title: "Create New Task",
            description:
              "Start a new task by setting a title, reward, and deadline.",
            side: "left",
          },
        },
        {
          element: TOUR_TARGETS.TASK_TABS,
          popover: {
            title: "Task Categories",
            description:
              "Switch between active, completed, canceled, and expired tasks.",
            side: "bottom",
          },
        },
        {
          element: TOUR_TARGETS.TASK_TABLE,
          popover: {
            title: "Task List",
            description:
              "View details of each task including title, reward, status, and deadline.",
            side: "top",
          },
        },
        {
          element: TOUR_TARGETS.WALLET_SIDEBAR,
          popover: {
            title: "Wallet Overview",
            description: "Quick view of your total and committed balance.",
            side: "left",
          },
        },
        {
          element: TOUR_TARGETS.DEPOSIT_BTN,
          popover: {
            title: "Deposit",
            description:
              "Add funds to your wallet to use for tasks and transfers.",
            side: "top",
          },
        },
        {
          element: TOUR_TARGETS.RECEIVE_BTN,
          popover: {
            title: "receive",
            description:
              "Receive funds funds using the qrcode or the address",
            side: "top",
          },
        },
        {
          element: TOUR_TARGETS.SEND_BTN,
          popover: {
            title: "Send",
            description:
              "Transfer ETH to another wallet directly from your dashboard.",
            side: "top",
          },
        },
      ],
    });
  }
  return tour;
}

export function startTour() {
  initTour().drive();
}

export default function IntroTour() {
  useEffect(() => {
    const hasSeenTour = localStorage.getItem("kairosTour");

    if (!hasSeenTour) {
      startTour();
      localStorage.setItem("kairosTour", "true");
    }
  }, []);

  return null;
}
