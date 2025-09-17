import { PrivyClient } from "@privy-io/server-auth";
import { cookies } from "next/headers";

// Initialize Privy client with app credentials
export const privyClient = new PrivyClient(
  process.env.NEXT_PRIVY_APP_ID!,
  process.env.NEXT_PRIVY_APP_SECRET!
);

// Verify a given auth token with Privy
export async function verifyToken(token?: string | null) {
  if (!token) return null;
  try {
    return await privyClient.verifyAuthToken(token);
  } catch (err) {
    console.warn("privy: token verify failed", err);
    return null;
  }
}

// Verify token stored in request cookies
export async function privyVerify() {
  const store = await cookies();
  const token = store.get("privy-token")?.value;
  if (!token) return null;
  return verifyToken(token);
}
