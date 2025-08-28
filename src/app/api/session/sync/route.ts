// app/api/session/sync/route.ts (server)
import { NextResponse } from "next/server";
import { privyVerify, privyClint } from "@/lib/auth/privy-server"; // fixed typo
import { readContract } from "@/hooks/web3/server";
import {
  CONTRACT_ADDRESSES,
  ACCOUNT_FACTORY_ABI,
} from "@/lib/contracts/contracts";

export async function POST(req: Request) {
  // verify session
  const session = await privyVerify();
  if (!session) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  // safe JSON parsing
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid-json" }, { status: 400 });
  }

  const walletAddress = body?.walletAddress;
  if (!walletAddress) {
    return NextResponse.json({ error: "no-wallet-provided" }, { status: 400 });
  }

  // confirm wallet belongs to user
  const userId = session.userId;
  let user;
  try {
    user = await privyClint.getUserByWalletAddress(walletAddress); // verify method exists
  } catch (err) {
    console.error("Privy API error:", err);
    return NextResponse.json({ error: "privy-lookup-failed" }, { status: 500 });
  }

  if (!user || user.id !== userId) {
    return NextResponse.json({ error: "wallet-not-linked" }, { status: 403 });
  }

  // on-chain check
  let rawRes;
  try {
    rawRes = await readContract({
      address: CONTRACT_ADDRESSES.ACCOUNT_FACTORY,
      abi: ACCOUNT_FACTORY_ABI,
      functionName: "getUserClone",
      args: [walletAddress],
    });
  } catch (e) {
    console.error("Chain read error:", e);
    return NextResponse.json({ error: "chain-read-failed" }, { status: 500 });
  }

  // runtime validation for hex string
  const smartAccountAddress =
    typeof rawRes === "string" && rawRes.startsWith("0x")
      ? (rawRes as `0x${string}`)
      : "0x0000000000000000000000000000000000000000";

  const isActivated =
    smartAccountAddress !== "0x0000000000000000000000000000000000000000" ||
    undefined;

  const res = NextResponse.json({
    ok: true,
    activated: isActivated,
  });

  // set hardened cookies
  res.cookies.set({
    name: "user_wallet",
    value: walletAddress.toLowerCase(),
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
  });

  res.cookies.set({
    name: "user_wallet_activated",
    value: isActivated ? "1" : "0",
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
  });

  res.cookies.set({
    name: "smart_wallet", // fixed naming to be consistent
    value: smartAccountAddress,
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
  });

  return res;
}
