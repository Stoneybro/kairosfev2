import type { PrivyClientConfig } from "@privy-io/react-auth";
import { baseSepolia,anvil } from "viem/chains";

// Replace this with your Privy config
export const privyConfig: PrivyClientConfig = {
  embeddedWallets: {
    createOnLogin: "users-without-wallets",
    requireUserPasswordOnCreate: false,
  },
  defaultChain:anvil,
  supportedChains: [baseSepolia,anvil],
  loginMethods: ["wallet", "email", "google","github"],
  appearance: {
    accentColor: "#38CCCD",
    theme: "light",
    landingHeader: "Kairos",
    walletChainType: "ethereum-only",
    walletList: ["detected_wallets"],
  },
};
