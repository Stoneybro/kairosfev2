
import { NextRequest } from "next/server";
import { privyClient, verifyToken } from "./privy-server";

// Verifies user authentication and wallet activation state
export async function verifyAuth(request: NextRequest) {
  // Extract bearer token from headers or fall back to cookie
  const authHeader = request.headers.get("authorization")?.trim() ?? "";
  const bearer = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader || null;

  // Session token stored in cookies
  const token = request.cookies.get("privy-token")?.value ?? null;
  const session = await verifyToken(token);

  // Wallet + activation flag stored in cookies
  const wallet = request.cookies.get("user_wallet")?.value;
  const activatedFlag =
    request.cookies.get("user_wallet_activated")?.value === "1";

  // If no valid session, check for wallet grace state
  if (!session) {
    if (wallet)
      return {
        isAuthenticated: false,
        isActivated: activatedFlag,
        grace: true, // grace = has wallet but no session
        wallet,
      };
    return { isAuthenticated: false, isActivated: false, grace: false };
  }

  // If session exists but wallet missing → fail
  if (!wallet)
    return { isAuthenticated: false, isActivated: false, grace: false };

  const userId = session.userId;

  try {
    // Verify wallet truly belongs to this Privy user
    const user = await privyClient.getUserByWalletAddress(wallet);
    if (!user || user.id !== userId) {
      return { isAuthenticated: false, isActivated: false, grace: false };
    }
  } catch (err) {
    console.error("Privy API error:", err);
    return { isAuthenticated: false, isActivated: false, grace: false };
  }

  // Passed all checks → return authenticated session
  return {
    isAuthenticated: true,
    isActivated: activatedFlag,
    userId,
    wallet,
    grace: false,
  };
}
