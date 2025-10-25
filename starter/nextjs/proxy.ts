import { headers } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';

import { auth } from '@/lib/auth';

export default async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    const redirectTo = request.nextUrl.pathname + request.nextUrl.search;
    return NextResponse.redirect(new URL(`/auth/sign-in?redirectTo=${redirectTo}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/account/:path*', '/organization/:path*'],
};
