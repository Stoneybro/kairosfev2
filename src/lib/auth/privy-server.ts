import { PrivyClient } from "@privy-io/server-auth";
import { cookies } from "next/headers";
export const privyClint = new PrivyClient(
  process.env.NEXT_PRIVY_APP_ID!,
  process.env.NEXT_PRIVY_APP_SECRET!
);

export async function privyVerify() {
  const store =await cookies();
  const token = store.get("privy-token")?.value;
  if (!token) return null;
  try {
    const verified = await privyClint.verifyAuthToken(token);
    return verified;
  } catch (error) {
    console.log(`Token verification failed with error ${error}.`);
  }
}
