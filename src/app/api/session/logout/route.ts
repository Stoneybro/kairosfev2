import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ ok: true });

  // Clear cookies by setting them with maxAge 0
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge: 0,
  };

  res.cookies.set("privy-token", "", cookieOptions);
  res.cookies.set("user_wallet", "", cookieOptions);
  res.cookies.set("user_wallet_activated", "", cookieOptions);
  res.cookies.set("smart_wallet", "", cookieOptions);

  return res;
}
