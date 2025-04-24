import {createClient} from '@supabase/supabase-js'
import type {NextRequest} from 'next/server'
import {NextResponse} from 'next/server'

// Define protected routes and their access levels
const protectedRoutes = {
    '/notes': 'user',
    '/api/summarize': 'user',
} as const;

// Security headers for protected routes
const securityHeaders = {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

export async function middleware(req: NextRequest) {
    try {
        // Create response with security headers
        const res = NextResponse.next();
        Object.entries(securityHeaders).forEach(([key, value]) => {
            res.headers.set(key, value);
        });

        // Create Supabase client with secure cookie handling
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                auth: {
                    persistSession: false,
                    autoRefreshToken: false,
                    detectSessionInUrl: false
                },
                cookies: {
                    get(name: string) {
                        return req.cookies.get(name)?.value;
                    },
                    set(name: string, value: string, options: any) {
                        // Secure cookie settings
                        res.cookies.set(name, value, {
                            ...options,
                            httpOnly: true,
                            secure: process.env.NODE_ENV === 'production',
                            sameSite: 'lax',
                            path: '/',
                        });
                    },
                    remove(name: string, options: any) {
                        res.cookies.set(name, '', {
                            ...options,
                            maxAge: -1,
                            httpOnly: true,
                            secure: process.env.NODE_ENV === 'production',
                            sameSite: 'lax',
                            path: '/',
                        });
                    },
                },
            }
        );

        // Rest of your middleware code remains the same
        // Check if the route is protected
        const isProtectedRoute = Object.keys(protectedRoutes).some(route =>
            req.nextUrl.pathname.startsWith(route)
        );

        if (isProtectedRoute) {
            // Get session with error handling
            const {data: {session}, error} = await supabase.auth.getSession();

            if (error) {
                console.error('Auth error:', error);
                return redirectToLogin(req);
            }

            if (!session) {
                return redirectToLogin(req);
            }

            // Add user info to headers for downstream use
            res.headers.set('X-User-ID', session.user.id);
        }

        return res;
    } catch (error) {
        console.error('Middleware error:', error);
        // On error, redirect to login for protected routes
        if (req.nextUrl.pathname.startsWith('/notes')) {
            return redirectToLogin(req);
        }
        return NextResponse.next();
    }
}

function redirectToLogin(req: NextRequest) {
    const redirectUrl = new URL('/login', req.url);
    redirectUrl.searchParams.set('redirectedFrom', req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
}

// Define which routes this middleware should run on
export const config = {
    matcher: [
        '/notes/:path*',
        '/api/summarize'
    ]
};