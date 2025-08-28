//lib/auth/middlewareAuth.ts
import { NextRequest } from "next/server";
import { privyClient, verifyToken } from "./privy-server";

export async function verifyAuth(request: NextRequest) {
  const authHeader = request.headers.get("authorization")?.trim() ?? "";
  const bearer = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader || null;
  const token = request.cookies.get("privy-token")?.value ?? null;
  const session = await verifyToken(token);
  const wallet = request.cookies.get("user_wallet")?.value;
  const activatedFlag =
    request.cookies.get("user_wallet_activated")?.value === "1";

  if (!session) {
    // allow a controlled grace if client still has wallet cookie. client will attempt immediate refresh.
    if (wallet)
      return {
        isAuthenticated: false,
        isActivated: activatedFlag,
        grace: true,
        wallet,
      };
    return { isAuthenticated: false, isActivated: false, grace: false };
  }
  if (!wallet)
    return { isAuthenticated: false, isActivated: false, grace: false };
  const userId = session.userId;
  try {
    const user = await privyClient.getUserByWalletAddress(wallet);
    if (!user || user.id !== userId) {
      return { isAuthenticated: false, isActivated: false, grace: false };
    }
  } catch (err) {
    console.error("Privy API error:", err);
    return { isAuthenticated: false, isActivated: false, grace: false };
  }

  return {
    isAuthenticated: true,
    isActivated: activatedFlag,
    userId,
    wallet,
    grace: false,
  };
}
