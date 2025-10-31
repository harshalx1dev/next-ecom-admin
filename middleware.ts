import { NextRequest, NextResponse } from 'next/server';

const publicRoutes = ['/sign-in', '/sign-up'];
const excludedPaths = [
  '/_next/',       // Next.js static files & HMR
  '/favicon.ico',
  '/robots.txt',
  '/manifest.json',
  '/api/',         // Optional: allow unauthenticated API access
];

const SESSION_API_ROUTE = `${process.env.SERVER_URL}/api/auth/session`;

const getSession = async (request: NextRequest) => {
  const cookies = request.headers.get('cookie');

  console.log('[COOKIES]', cookies);
  console.log('[URL]', request.nextUrl);

  if (!cookies) return { userId: null, status: 401 };

  try {
    const apiResponse = await fetch(SESSION_API_ROUTE, {
      method: 'GET',
      headers: {
        'Cookie': cookies,
        'Content-Type': 'application/json',
      },
    });

    if (apiResponse.status === 401) return { userId: null, status: 401 };
    if (!apiResponse.ok) return { userId: null, status: apiResponse.status };

    const data = await apiResponse.json();
    if (data.status === 'success' && data.data) {
      return { ...data.data, userId: data.data.id, status: 200 };
    }
  } catch (error) {
    console.error('Session fetch failed in Middleware:', error);
  }

  return { userId: null, status: 401 };
};

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip public pages and static/Next.js files
  const isPublic = publicRoutes.some(path => pathname.startsWith(path));
  const isExcluded = excludedPaths.some(path => pathname.startsWith(path));

  if (isPublic || isExcluded) return NextResponse.next();

  // Only protect real pages
  const session = await getSession(request);

  // Optional: only log for real page requests
  console.log('SESSION CHECK:', session, pathname);

  if (session.status === 401) {
    const url = request.nextUrl.clone();
    url.pathname = '/sign-in';
    url.search = `?next=${pathname}`;
    return NextResponse.redirect(url);
  }

  if (session.status === 200) {
    const response = NextResponse.next();
    response.headers.set('x-user-id', session.userId);
    return response;
  }

  // Fallback
  return NextResponse.next();
}

// Define paths where this middleware runs
export const config = {
  matcher: ['/((?!_next/static|favicon.ico).*)'], // run on all except static assets
};
