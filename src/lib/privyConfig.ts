import type { PrivyClientConfig } from "@privy-io/react-auth";
import { baseSepolia } from "viem/chains";

// Replace this with your Privy config
export const privyConfig: PrivyClientConfig = {
  embeddedWallets: {
    createOnLogin: "users-without-wallets",
    requireUserPasswordOnCreate: false,
  },
  defaultChain:baseSepolia,
  supportedChains: [baseSepolia],
  loginMethods: ["wallet", "email", "google","github"],
  appearance: {
    accentColor: "#38CCCD",
    theme: "light",
    landingHeader: "Kairos",
    walletChainType: "ethereum-only",
    walletList: ["detected_wallets"],
  },
};
