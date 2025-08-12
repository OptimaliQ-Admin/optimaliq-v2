// File: middleware.ts
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { GDPR_COUNTRIES, logGDPRAccessAttempt } from "@/lib/utils/gdpr";

// This middleware protects all /premium routes, sets country code, and blocks GDPR regions
export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Get visitor's country from Vercel's geo data
  const country = (req as any).geo?.country || "US"; // fallback to US
  
  // Set country code cookie for client-side usage
  res.cookies.set("country_code", country, {
    path: "/",
    httpOnly: false, // Allow client-side access
    secure: process.env.NODE_ENV === "production", // Secure in production
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  // Check if user is from a GDPR country and block access
  if (GDPR_COUNTRIES.includes(country)) {
    // Log the blocked access attempt
    await logGDPRAccessAttempt(country, req.nextUrl.pathname, req.headers.get('user-agent') || undefined);
    
    // Don't block access to the blocked page itself to avoid redirect loops
    if (req.nextUrl.pathname === '/blocked') {
      return res;
    }
    
    // Redirect to blocked page
    return NextResponse.redirect(new URL("/blocked", req.url));
  }

  // Create Supabase client with request/response context
  const supabase = createMiddlewareClient({ req, res });

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If no session and trying to access premium routes, redirect to login
  if (!session && req.nextUrl.pathname.startsWith('/premium')) {
    // Allow access to assessment invitations without authentication
    if (req.nextUrl.pathname.startsWith('/premium/assessment/') && req.nextUrl.searchParams.has('invitation')) {
      return res;
    }
    
    const redirectUrl = new URL('/subscribe/login', req.url);
    return NextResponse.redirect(redirectUrl);
  }

  // If user is authenticated and trying to access premium routes, check subscription status
  if (session && req.nextUrl.pathname.startsWith('/premium')) {
    // Skip subscription check for assessment invitations
    if (req.nextUrl.pathname.startsWith('/premium/assessment/') && req.nextUrl.searchParams.has('invitation')) {
      return res;
    }
    
    try {
      // Get user's subscription status from new subscriptions table
      const { data: subscription, error } = await supabase
        .from('subscriptions')
        .select('status')
        .eq('user_id', session.user.id)
        .single();

      if (error) {
        console.error('Error fetching subscription status:', error);
        // If we can't fetch subscription, redirect to subscribe page
        const redirectUrl = new URL('/subscribe', req.url);
        return NextResponse.redirect(redirectUrl);
      }

      // Check if subscription is active or trial
      if (!subscription || (subscription.status !== 'active' && subscription.status !== 'trial')) {
        console.log(`User has inactive subscription (${subscription?.status || 'none'}), redirecting to subscribe`);
        
        // Redirect to subscribe page with a message
        const redirectUrl = new URL('/subscribe', req.url);
        redirectUrl.searchParams.set('message', 'subscription_required');
        return NextResponse.redirect(redirectUrl);
      }
    } catch (error) {
      console.error('Error in subscription check middleware:', error);
      // If there's an error, redirect to subscribe page
      const redirectUrl = new URL('/subscribe', req.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return res;
}

// ✅ Apply to all routes except static assets
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    // Exclude delegate invite paths from middleware to avoid any redirects/geo gating
    '/((?!api|_next/static|_next/image|favicon.ico|public|delegate).*)',
  ],
};