//lib/auth/middlewareAuth.ts

import { NextRequest } from "next/server";
import { verifyToken } from "./privy-server";

export async function verifyAuth(request: NextRequest) {
    const token=request.cookies.get("privy-token")?.value??null
const session= await verifyToken(token);
if(!session)return{isAuthenticated:false,isActivated:false};
const wallet=request.cookies.get("user_wallet")?.value;
const activatedFlag=request.cookies.get("user_wallet_activated")?.value==="1";
return {isAuthenticated:!!wallet,isActivated:activatedFlag};
}