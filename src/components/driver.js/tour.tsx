// components/IntroTour.tsx
"use client";

import { useEffect } from "react";
import { driver } from "driver.js";
import { TOUR_TARGETS } from "@/utils/constants";
import "driver.js/dist/driver.css";

let tour: ReturnType<typeof driver> | null = null;

/**
 * Initialize the driver.js tour once.
 * Returns a singleton instance to avoid multiple tour objects.
 */
function initTour() {
  if (!tour) {
    tour = driver({
      showProgress: true,
      steps: [
        {
          popover: {
            title: "Welcome to Kairos",
            description: `Hey there 👋 Welcome to Kairos. Think of this as your personal smart wallet for discipline. 
            Take a quick tour, claim some ETH from the wallet, try things out, and let me know what you think on Twitter 
            <a href="https://twitter.com/z__stone" target="_blank" style="color:#1DA1F2; font-weight:600; text-decoration:none;">
              @z__stone
            </a>`,
          },
        },
        {
          popover: {
            title: "What is Kairos?",
            description: `
              Kairos is a smart wallet built for discipline and accountability.<br /><br />
              • <b>Smart account:</b> ERC-4337 powered wallet.<br />
              • <b>Gasless actions:</b> Send, receive, and complete tasks without fees.<br />
              • <b>Social login:</b> Create with social accounts—no seed phrase.<br />
              • <b>Accountability:</b> Task results auto-move funds for rewards/penalties.
            `,
            side: "bottom",
            align: "center",
          },
        },
        {
          element: TOUR_TARGETS.DASHBOARD_CARDS,
          popover: {
            title: "Your Overview",
            description:
              "See balance, active tasks, committed funds, and performance at a glance.",
            side: "bottom",
            align: "center",
          },
        },
        {
          element: TOUR_TARGETS.DASHBOARD_TASKS,
          popover: {
            title: "Create and Track Tasks",
            description: `
              <div style="line-height:1.4;">
                <p style="margin:0 0 8px 0;">Tasks directly lock/unlock funds:</p>
                <ul style="margin:0 0 0 16px; padding:0;">
                  <li><strong>Completed / Canceled:</strong> Funds return to balance.</li>
                  <li>
                    <strong>Expired:</strong> Depends on penalty:
                    <ul style="margin:0 0 0 8px; padding:0;">
                      <li>• Delayed payment: Unlock after delay.</li>
                      <li>• Send to buddy: Auto-transfer to partner.</li>
                    </ul>
                  </li>
                </ul>
              </div>
            `,
            side: "top",
            align: "center",
          },
        },
        {
          element: TOUR_TARGETS.WALLET_SIDEBAR,
          popover: {
            title: "Wallet Overview",
            description: "Quick view of total and committed balance.",
            side: "left",
          },
        },
        {
          element: TOUR_TARGETS.SEND_RECEIVE_BTN,
          popover: {
            title: "Send & Receive",
            description:
              "Gas-free ETH transfers—send to any wallet or receive from others.",
            side: "top",
          },
        },
        {
          element: TOUR_TARGETS.CLAIM_FAUCET_BTN,
          popover: {
            title: "Claim Test Funds",
            description:
              "Top up with free test ETH to explore features risk-free.",
            side: "top",
          },
        },
        {
          element: TOUR_TARGETS.WALLET_ACTIVITY,
          popover: {
            title: "Wallet Activity",
            description:
              "See transaction history. (Task transactions not shown yet)",
            side: "top",
          },
        },
        {
          element: TOUR_TARGETS.SETTINGS,
          popover: {
            title: "Settings",
            description: `
              Manage your account:  
              • <b>Switch chains:</b> Jump across supported networks.  
              • <b>Logout:</b> Securely sign out.  
            `,
            side: "top",
          },
        },
      ],
    });
  }
  return tour;
}

/** Start the tour */
export function startTour() {
  initTour().drive();
}

/**
 * Runs the tour once per user.
 * Stores a "seen" flag in localStorage.
 */
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
