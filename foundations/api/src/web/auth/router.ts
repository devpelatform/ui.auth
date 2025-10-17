import { Hono } from 'hono';

import { auth } from '@repo/auth';

export const authRouter = new Hono()
  .get('/**', (c) => {
    return auth.handler(c.req.raw);
  })
  .post('/**', (c) => {
    return auth.handler(c.req.raw);
  });
