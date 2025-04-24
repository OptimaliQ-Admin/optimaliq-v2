// File: middleware.ts
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse, type NextRequest } from "next/server";

// This middleware protects all /premium routes
export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Create Supabase client with request/response context
  const supabase = createMiddlewareClient({ req, res });

  // Check if user has a valid session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const isProtectedRoute = req.nextUrl.pathname.startsWith("/premium");
  const isAuthRoute = req.nextUrl.pathname.startsWith("/subscribe");

  // ✅ If accessing a protected page but not logged in, redirect to login
  if (isProtectedRoute && !session) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/subscribe/login";
    redirectUrl.searchParams.set("redirectedFrom", req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // ✅ Prevent logged-in users from accessing login/signup again
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL("/premium/dashboard", req.url));
  }

  return res;
}

// ✅ Apply only to /premium and /subscribe routes
export const config = {
  matcher: ["/premium/:path*", "/subscribe/:path*"],
};