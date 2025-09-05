//middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAuth } from "./lib/auth/middlewareAuth";
export async function middleware(request: NextRequest) {
  const { isAuthenticated, isActivated, grace } = await verifyAuth(request);
  const isLoginPage = request.nextUrl.pathname.startsWith("/login");
  const isActivatePage = request.nextUrl.pathname.startsWith("/activatewallet");
  if (!isAuthenticated) {
    if (grace && request.method === "GET") {
      const res = NextResponse.next();
      res.headers.set("x-auth-grace", "1");
      return res;
    }
    if (!isLoginPage) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (isAuthenticated && !isActivated && !isActivatePage) {
    return NextResponse.redirect(new URL("/activatewallet", request.url));
  }
  if (isAuthenticated && isActivated && (isLoginPage || isActivatePage)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  return NextResponse.next();
}
export const config = {
  matcher: ["/dashboard/:path*", "/dashboard", "/activatewallet", "/login"],
};
