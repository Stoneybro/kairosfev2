import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAuth } from "./lib/auth/middlewareAuth";

// Main middleware entry point
export async function middleware(request: NextRequest) {
  const { isAuthenticated, isActivated, grace } = await verifyAuth(request);

  // path checks
  const isLoginPage = request.nextUrl.pathname.startsWith("/login");
  const isActivatePage = request.nextUrl.pathname.startsWith("/activatewallet");

  // unauthenticated flow
  if (!isAuthenticated) {
    // allow "grace" browsing if flagged (e.g. wallet linked but no token yet)
    if (grace && request.method === "GET") {
      const res = NextResponse.next();
      res.headers.set("x-auth-grace", "1"); // signal frontend about grace mode
      return res;
    }
    // otherwise, force redirect to login
    if (!isLoginPage) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // authenticated but wallet not activated → send to activation page
  if (isAuthenticated && !isActivated && !isActivatePage) {
    return NextResponse.redirect(new URL("/activatewallet", request.url));
  }

  // authenticated + activated but user is on login/activate → redirect home
  if (isAuthenticated && isActivated && (isLoginPage || isActivatePage)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // default: continue request
  return NextResponse.next();
}

// match only protected routes
export const config = {
  matcher: ["/dashboard/:path*", "/dashboard", "/activatewallet", "/login"],
};
