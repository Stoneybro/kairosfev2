import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAuth } from "./lib/auth/middlewareAuth";
export async  function middleware(request: NextRequest) {
 const { isAuthenticated, isActivated } = await verifyAuth(request);
    request.cookies.get("user_wallet_activated")?.value === "1";
  const isLoginPage = request.nextUrl.pathname.startsWith("/login");
  const isActivatePage = request.nextUrl.pathname.startsWith("/activateWallet");
  if (!isAuthenticated && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (isAuthenticated &&!isActivated && !isActivatePage) {
    return NextResponse.redirect(new URL("/activateWallet", request.url));
  }
  if (isAuthenticated && isActivated && (isLoginPage || isActivatePage)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  return NextResponse.next();
}
export const config = {
  matcher: ["/dashboard/:path*", "/dashboard", "/activateWallet", "/login"],
};
