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
            description: `Hey there 👋 Welcome to Kairos. Think of this as your personal smart wallet for discipline. Take a quick tour,claim some ETH from the wallet, try things out, and let me know what you think on Twitter <a href="https://twitter.com/z__stone" target="_blank" style="color:#1DA1F2; font-weight:600; text-decoration:none;">
        @z__stone
      </a>`,
          },
        },
        {
          popover: {
            title: "What is Kairos?",
            description: `
      Kairos is a smart wallet built for discipline and accountability.<br /><br />
      • <b>Smart account:</b> Works like a normal wallet, but powered by ERC-4337.<br />
      • <b>Gasless actions:</b> No funds wasted while sending, receiving, or completing tasks.<br />
      • <b>Social login:</b> Create your wallet with just your social accounts—no seed phrase needed.<br />
      • <b>Accountability:</b> Task outcomes move your funds automatically, rewarding discipline and enforcing penalties.
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
              "All your key stats; available balance, active tasks,commited funds and performance, are summarized here at a glance.",
            side: "bottom",
            align: "center",
          },
        },
        {
          element: TOUR_TARGETS.DASHBOARD_TASKS,
          popover: {
            title: "Create and Track your tasks",
            description: `
      <div style="line-height:1.4; ">
        <p style="margin:0 0 8px 0;">Tasks are tied directly to your balance.</p>
        <ul style="margin:0 0 0 16px; padding:0;">
          <li><strong>Completed / Canceled Tasks:</strong> Funds return to your available balance.</li>
          <li>
            <strong>Expired Task:</strong> Depends on penalty.
            <ul style="margin:0 0 0 8px; padding:0;">
              <li>• Delayed payment: You can unlock once the delay ends.</li>
              <li>• Send to buddy: Funds auto-transfer to your buddy.</li>
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
            description: "Quick view of your total and committed balance.",
            side: "left",
          },
        },
        {
          element: TOUR_TARGETS.SEND_RECEIVE_BTN,
          popover: {
            title: "Send & Receive",
            description:
              "Send ETH seamlessly to any wallet or receive from others gas-free with your smart wallet.",
            side: "top",
          },
        },
        {
          element: TOUR_TARGETS.CLAIM_FAUCET_BTN,
          popover: {
            title: "Claim Test Funds",
            description:
              "Top up your wallet with free test ETH to explore Kairos features—no cost, no risk.",
            side: "top",
          },
        },

        {
          element: TOUR_TARGETS.WALLET_ACTIVITY,
          popover: {
            title: "Wallet Activity",
            description:
              "Track every transaction in your activity feed. (task transactions are not available currently)",
            side: "top",
          },
        },

        {
          element: TOUR_TARGETS.SETTINGS,
          popover: {
            title: "Settings",
            description: `
      Manage your account in one place:  
      • <b>Switch chains:</b> Move between supported networks.  
      • <b>Logout:</b> Securely sign out of Kairos.  
    `,
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
