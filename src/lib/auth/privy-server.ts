//lib/auth/privyserver.ts

import { PrivyClient } from "@privy-io/server-auth";
import { cookies } from "next/headers";
export const privyClint = new PrivyClient(
  process.env.NEXT_PRIVY_APP_ID!,
  process.env.NEXT_PRIVY_APP_SECRET!
);
export async function verifyToken(token?: string | null) {
  if (!token) return null;
  try {
    return await privyClint.verifyAuthToken(token);
  } catch (err) {
    console.warn("privy: token verify failed", err);
    return null;
  }
}
export async function privyVerify() {
  const store =await cookies();
  const token = store.get("privy-token")?.value;
  if (!token) return null;
return verifyToken(token)
}
