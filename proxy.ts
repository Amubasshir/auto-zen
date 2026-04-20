import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

type AuthedSession = { user?: { id?: string } } | null;

/**
 * Pure redirect logic — extracted for unit testing without edge-runtime dependencies.
 */
export function getRedirectUrl(
  pathname: string,
  session: AuthedSession,
  baseUrl: string,
): string | null {
  const isAuthed = Boolean(session?.user?.id);

  // Unauthenticated — protect dashboard and onboarding
  if (!isAuthed) {
    if (pathname.startsWith("/dashboard") || pathname === "/onboarding") {
      return `${baseUrl}/login`;
    }
    return null;
  }

  // Authenticated on auth pages — send to dashboard
  if (pathname === "/login" || pathname === "/signup") {
    return `${baseUrl}/dashboard`;
  }

  return null;
}

export default auth(function middleware(
  req: NextRequest & { auth: AuthedSession },
) {
  const { pathname } = req.nextUrl;
  const baseUrl = req.nextUrl.origin;
  const redirectUrl = getRedirectUrl(pathname, req.auth, baseUrl);

  if (redirectUrl) {
    return NextResponse.redirect(new URL(redirectUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/onboarding", "/login", "/signup"],
};
