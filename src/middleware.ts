import { NextRequest, NextResponse } from "next/server";
import { getClientIp, checkRateLimit, resolveRouteKey, rateLimitResponse } from "@/lib/rate-limiter";

/**
 * Global Middleware for API Rate Limiting
 * 
 * This intercepts all requests to /api/* and applies the sliding window
 * rate limiting defined in src/lib/rate-limiter.ts.
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only apply rate limiting to /api routes
  if (pathname.startsWith("/api")) {
    const ip = getClientIp(req);
    const routeKey = resolveRouteKey(pathname);
    
    const result = checkRateLimit(ip, routeKey);

    if (!result.allowed) {
      console.warn(
        `[Middleware] BLOCKED — Route: ${routeKey}, IP: ${ip}, Limit: ${result.limit}/min`
      );
      return rateLimitResponse(result);
    }

    // Optional: Add rate limit info to response headers for all requests
    const response = NextResponse.next();
    response.headers.set("X-RateLimit-Limit", String(result.limit));
    response.headers.set("X-RateLimit-Remaining", String(result.remaining));
    return response;
  }

  return NextResponse.next();
}

// Map the middleware to only run on API routes for efficiency
export const config = {
  matcher: "/api/:path*",
};
