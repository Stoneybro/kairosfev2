// src/lib/smartAccountClient.ts
import { createSmartAccountClient } from "permissionless";
import { http } from "viem";
import { baseSepolia } from "viem/chains";
import { pimlicoClient, pimlicoBundlerUrl } from "./pimlico";
import { CustomSmartAccount } from "./customSmartAccount";

export async function getSmartAccountClient(
  customSmartAccount: CustomSmartAccount
) {
  return createSmartAccountClient({
    account: customSmartAccount,
    chain: baseSepolia,
    bundlerTransport: http(pimlicoBundlerUrl),
    paymaster: pimlicoClient, // optional
    userOperation: {
      estimateFeesPerGas: async () => {
        return (await pimlicoClient.getUserOperationGasPrice()).fast; // only when using pimlico bundler
      },
    },
  });
}
