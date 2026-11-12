import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
    const requestedPath =
      request.nextUrl.pathname + request.nextUrl.search;

    const loginUrl = new URL("/login", request.url);

    loginUrl.searchParams.set("callbackUrl", requestedPath);

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/add-book/:path*",
    "/my-books/:path*",
    "/my-borrows/:path*",
    "/profile/:path*",
    "/books/:id",
  ],
};
