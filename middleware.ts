import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const { pathname } = request.nextUrl
  
  // Check if user has auth token (simplified check - you might want to verify the token)
  const authToken = request.cookies.get('auth_token')?.value
  const isAuthenticated = !!authToken
  
  // Define auth pages that authenticated users shouldn't access
  const authPages = ['/login', '/signup', '/forgot-password', '/reset-password']
  
  // Define protected routes that require authentication
  const protectedRoutes = ['/account', '/checkout', '/orders', '/wishlist']
  
  // Check if current path is an auth page
  const isAuthPage = authPages.some(page => pathname.startsWith(page))
  
  // Check if current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  
  // If user is authenticated and trying to access auth pages
  if (isAuthenticated && isAuthPage) {
    // Redirect to account page or a specified redirect URL
    const redirectUrl = request.nextUrl.searchParams.get('redirect') || '/account'
    return NextResponse.redirect(new URL(redirectUrl, request.url))
  }
  
  // If user is not authenticated and trying to access protected routes
  if (!isAuthenticated && isProtectedRoute) {
    // Redirect to login with the intended destination
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }
  
  return NextResponse.next()
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)',
  ],
} 