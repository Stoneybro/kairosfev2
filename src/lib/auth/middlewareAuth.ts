import { NextRequest } from "next/server";
import { privyVerify } from "./privy-server";

export async function verifyAuth(request: NextRequest) {
const session= await privyVerify();
if(!session)return{isAuthenticated:false,isActivated:false};
const wallet=request.cookies.get("user_wallet")?.value;
const activatedFlag=request.cookies.get("user_wallet_activated")?.value==="1";
return {isAuthenticated:!!wallet,isActivated:activatedFlag};
}