import { createMiddleware } from 'hono/factory';

import { auth } from '@repo/auth';
import type { Session } from '@repo/auth/types';

export const authMiddleware = createMiddleware<{
  Variables: {
    session: Session['session'] | null;
    user: Session['user'] | null;
  };
}>(async (c, next) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  if (!session) {
    c.set('user', null);
    c.set('session', null);
    return c.json({ error: 'Unauthorized' }, 401);
  }

  c.set('session', session.session);
  c.set('user', session.user);

  await next();
});

export const adminMiddleware = createMiddleware<{
  Variables: {
    session: Session['session'] | null;
    user: Session['user'] | null;
  };
}>(async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    c.set('user', null);
    c.set('session', null);
    return c.json({ error: 'Unauthorized' }, 401);
  }

  if (session.user.role !== 'admin') {
    c.set('user', null);
    c.set('session', null);
    return c.json({ error: 'Forbidden' }, 403);
  }

  c.set('session', session.session);
  c.set('user', session.user);

  await next();
});
