import { headers } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';

import { auth } from '@repo/auth';
import { config as configBase } from '@repo/config';

export default async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    const redirectTo = request.nextUrl.pathname + request.nextUrl.search;
    return NextResponse.redirect(
      new URL(`${configBase.path.auth.SIGN_IN}?redirectTo=${redirectTo}`, request.url),
    );
  }

  return NextResponse.next();
}

// export const config = {
//   runtime: 'nodejs',
//   matcher: ['/account'],
// };
