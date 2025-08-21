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
    console.log("validateDirectly");
    const provider = await owner?.getEthereumProvider();
    const account = smartAccountClient?.account;
    if (!account || !provider || !owner)
      throw new Error("missing prerequisites");

    // use the account helper to encode the callData (keep consistent)
    const callData = await account.encodeCalls([
      { to: account.address, data: "0x", value: 0n },
    ]);
    const pk =
      "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
    const acct = privateKeyToAccount(pk);
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

    // 1) compute canonical userOpHash BEFORE signing
    const userOpHashBeforeSign = await publicClient.readContract({
      address: ENTRY,
      abi: ENTRYPOINT_ABI as any,
      functionName: "getUserOpHash",
      args: [uo],
    });
    console.log("userOpHashBeforeSign:", userOpHashBeforeSign);

    // 2) sign the eth-prefixed hash (what your contract expects)
    const ethSigned = hashMessage(userOpHashBeforeSign as string);
    console.log("ethSigned:", ethSigned);

    const rawResp = await provider.request({
      method: "personal_sign",
      params: [userOpHashBeforeSign as `0x${string}`, owner.address],
    });
    console.log("rawResp:", rawResp);
    const rawResp1 = await acct.signMessage({
      message: { raw: stringToBytes(userOpHashBeforeSign as `0x${string}`) },
    });
    console.log("rawresp1:", rawResp1);
    console.log("is rawresp===rawResp1?", rawResp === rawResp1);
    const providerSig = normalizeAndCanonicalizeSignature(rawResp);
    console.log(
      "normalizedSig:",
      providerSig,
      "len:",
      (providerSig.length - 2) / 2
    );

    // 3) local recovery sanity check
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

    // attach signature
    const uoWithSig = { ...uo, signature: providerSig } as any;

    // 4) compute userOpHash AGAIN right before simulate/send using the exact same object
    const userOpHashBeforeSim = await publicClient.readContract({
      address: ENTRY,
      abi: ENTRYPOINT_ABI as any,
      functionName: "getUserOpHash",
      args: [uoWithSig], // include signature field same shape as will be submitted
    });
    console.log("userOpHashBeforeSim:", userOpHashBeforeSim);

    // quick equality check
    console.log("hashes equal:", userOpHashBeforeSign === userOpHashBeforeSim);
    const sig = providerSig.replace(/^0x/, "");
    const r = "0x" + sig.slice(0, 64);
    const s = "0x" + sig.slice(64, 128);
    const vHex = sig.slice(128, 130);
    const vNum = parseInt(vHex, 16);
    console.log({ r, s, vHex, vNum });
    const CURVE_N = BigInt(
      "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141"
    );
    const HALF_N = CURVE_N / 2n;
    console.log("s <= HALF_N?", BigInt(s) <= HALF_N);
    console.log("v canonical (27/28)?", vNum === 27 || vNum === 28);

    // 5) call simulateValidation on EntryPoint (or eth_call from EntryPoint to account)
    try {
      const calldata = encodeFunctionData({
        abi: SMART_ACCOUNT_ABI as any,
        functionName: "validateUserOp",
        args: [uo, userOpHashBeforeSim, 0n],
      });

      // raw eth_call (so we can inspect revert data)
      const res = await publicClient
        .request({
          method: "eth_call",
          params: [
            { to: account.address, data: calldata, from: ENTRY },
            "latest",
          ],
        })
        .catch((e) => e); // capture error object

      console.log("eth_call response / error:", res);
      return true;
    } catch (err) {
      console.error("simulateValidation revert:", err);
      return false;
    }
  }

  return validateDirectly;
}
