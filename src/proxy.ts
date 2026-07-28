import { NextResponse, type NextRequest } from "next/server";

import { decryptSession } from "@/lib/auth/jwt";

/**
 * Optimistic auth redirects. This runs before render on matched routes, so it
 * only reads + verifies the session cookie (Edge-safe `jose`) — no store or DB
 * access. It's a fast first gate, NOT the security boundary: pages and actions
 * re-check via the DAL (`src/lib/auth/dal.ts`) close to the data.
 */
const PROTECTED_PREFIXES = ["/studio"];
const AUTH_ROUTES = ["/login", "/register"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await decryptSession(
    request.cookies.get("session")?.value,
  );
  const isAuthed = Boolean(session?.userId);

  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  if (isProtected && !isAuthed) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthRoute && isAuthed) {
    return NextResponse.redirect(new URL("/studio", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Run on everything except Next internals, the API, and static assets.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
