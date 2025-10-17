import { Hono } from 'hono';

import { healthRouter } from './health/router';
import { webhooksRouter } from './webhooks/router';

export const routes = new Hono()
  .basePath('/')
  .route('/health', healthRouter)
  .route('/webhooks', webhooksRouter);
