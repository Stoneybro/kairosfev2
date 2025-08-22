"use client";
import { useSmartAccount } from "@/lib/useSmartAccount";
import { toast } from "sonner";
import { usePrivy, useSignMessage, useWallets } from "@privy-io/react-auth";
import { publicClient } from "@/lib/pimlico";
import { ENTRYPOINT_ABI, SMART_ACCOUNT_ABI } from "@/lib/contracts";
import {
  encodeFunctionData,
  hashMessage,
  recoverAddress,
  stringToHex,
  hexToBytes,
  Hex,
  ByteArray,
  stringToBytes,
  bytesToHex,
  recoverMessageAddress,
} from "viem";
import { normalizeAndCanonicalizeSignature } from "@/lib/helpers";
import { privateKeyToAccount } from "viem/accounts";

export function useActivateWallet() {
  const { initClient } = useSmartAccount();
  const { user } = usePrivy();
  const { wallets } = useWallets();
  const owner = wallets[0]; // Assuming the first wallet is the one to activate

  const { signMessage: privySignMessage } = useSignMessage();
  async function handleActivateWallet() {
    try {
      const smartAccountClient = await initClient();
      console.log("smartAccountClient", smartAccountClient?.account?.address);
      if (!smartAccountClient) {
        throw new Error("Smart Account Client is not initialized");
      }
      const hash = await smartAccountClient.sendUserOperation({
        account: smartAccountClient.account,
        calls: [
          {
            to: owner?.address as `0x${string}`,
            data: "0x",
            value: 0n,
          },
        ],
      });
      await smartAccountClient.waitForUserOperationReceipt({ hash });
      toast.success("Wallet activated successfully");
      return true;
    } catch (error) {
      console.log("Error activating wallet", error);
      toast.error("Failed to activate wallet");
      return false;
    }
  }
  async function validateDirectly() {
    const ENTRY = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
    const smartAccountClient = await initClient();

    const provider = await owner?.getEthereumProvider();
    const account = smartAccountClient?.account;
    if (!account || !provider || !owner)
      throw new Error("missing prerequisites");

    const callData = await account.encodeCalls([
      { to: account.address, data: "0x", value: 0n },
    ]);

    const uo = {
      sender: account.address,
      nonce: 0n,
      initCode: "0x",
      callData,
      callGasLimit: 1000000n,
      verificationGasLimit: 1000000n,
      preVerificationGas: 21000n,
      maxFeePerGas: 1007137n,
      maxPriorityFeePerGas: 1000000n,
      paymasterAndData: "0x",
      signature: "0x",
    } as const;


    const userOpHashBeforeSign = await publicClient.readContract({
      address: ENTRY,
      abi: ENTRYPOINT_ABI as any,
      functionName: "getUserOpHash",
      args: [uo],
    });
    console.log("userOpHashBeforeSign:", userOpHashBeforeSign);

    const ethSigned = hashMessage(userOpHashBeforeSign as string);

    const rawResp = await provider.request({
      method: "personal_sign",
      params: [ethSigned as `0x${string}`, owner.address],
    });
    console.log("rawResp:", rawResp);
    const providerSig = normalizeAndCanonicalizeSignature(rawResp);
    console.log(
      "normalizedSig:",
      providerSig,
      "len:",
      (providerSig.length - 2) / 2
    );

    const recovered = await recoverMessageAddress({
      message: userOpHashBeforeSign as `0x${string}`,
      signature: providerSig,
    });


    console.log(
      "local recovered:",
      recovered,
      "expected owner:",
      owner.address
    );

    const uoWithSig = { ...uo, signature: providerSig } as any;

    const userOpHashBeforeSim = await publicClient.readContract({
      address: ENTRY,
      abi: ENTRYPOINT_ABI as any,
      functionName: "getUserOpHash",
      args: [uoWithSig], 
    });


    try {
      const calldata = encodeFunctionData({
        abi: SMART_ACCOUNT_ABI as any,
        functionName: "validateUserOp",
        args: [uo, userOpHashBeforeSim, 0n],
      });


      const res = await publicClient
        .request({
          method: "eth_call",
          params: [
            { to: account.address, data: calldata, from: ENTRY },
            "latest",
          ],
        })
        .catch((e) => e); 

      console.log("eth_call response / error:", res);
      return true;
    } catch (err) {
      console.error("simulateValidation revert:", err);
      return false;
    }
  }

  return handleActivateWallet;
}
