import { NextResponse } from "next/server";
import { privyVerify, privyClient } from "@/lib/auth/privy-server";
import { readContract } from "@/hooks/web3/server";
import {
  CONTRACT_ADDRESSES,
  ACCOUNT_FACTORY_ABI,
} from "@/lib/contracts/contracts";

const ZERO = "0x0000000000000000000000000000000000000000";

// cookie settings
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days
const COOKIE_SECURE = process.env.NODE_ENV === "production";

export async function POST(req: Request) {
  // enforce method and basic origin/referrer checks in production
  const reqUrl = new URL(req.url);
  if (process.env.NODE_ENV === "production") {
    const origin = req.headers.get("origin");
    const referer = req.headers.get("referer");
    const requestOrigin = reqUrl.origin;

    const originOk = origin ? origin === requestOrigin : false;
    const refererOk = referer ? referer.startsWith(requestOrigin) : false;

    if (!originOk && !refererOk) {
      return NextResponse.json({ error: "invalid-origin" }, { status: 403 });
    }
  }

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
    user = await privyClient.getUserByWalletAddress(walletAddress);
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

  const smartAccountAddress =
    typeof rawRes === "string" && rawRes.startsWith("0x") ? rawRes : ZERO;

  const isActivated = smartAccountAddress !== ZERO;

  const res = NextResponse.json({
    ok: true,
    activated: isActivated,
  });

  // set hardened cookies with explicit lifetime and env-aware secure flag
  const cookieOptions = {
    httpOnly: true,
    secure: COOKIE_SECURE,
    sameSite: "strict" as const,
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  };

  res.cookies.set({
    name: "user_wallet",
    value: walletAddress.toLowerCase(),
    ...cookieOptions,
  });

  res.cookies.set({
    name: "user_wallet_activated",
    value: isActivated ? "1" : "0",
    ...cookieOptions,
  });

  res.cookies.set({
    name: "smart_wallet",
    value: smartAccountAddress,
    ...cookieOptions,
  });

  return res;
}
