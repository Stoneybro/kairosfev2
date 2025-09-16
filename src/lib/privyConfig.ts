import type { PrivyClientConfig } from "@privy-io/react-auth";
import { baseSepolia } from "viem/chains";

export const privyConfig: PrivyClientConfig = {
  embeddedWallets: {
    createOnLogin: "users-without-wallets",
    requireUserPasswordOnCreate: false,
  },
  defaultChain:baseSepolia,
  supportedChains: [baseSepolia],
  loginMethods: [ "email", "google","github"],
  appearance: {
    accentColor: "#38CCCD",
    theme: "dark",
    landingHeader: "Kairos",
    walletChainType: "ethereum-only",
    walletList: ["detected_wallets"],
  },
};
