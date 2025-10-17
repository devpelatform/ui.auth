import { Scalar } from '@scalar/hono-api-reference';
import { Hono } from 'hono';
import { openAPIRouteHandler } from 'hono-openapi';

import { config } from '@repo/config';
import { corsDefaultMiddleware } from './middleware/cors';
import { docsAuthMiddleware } from './middleware/docs';
import { loggerMiddleware } from './middleware/logger';
import { routes } from './routes';

export const app = new Hono();

app.use(loggerMiddleware);
app.use(corsDefaultMiddleware);

app.get('/', (c) => {
  return c.json({
    message: `Hello from ${config.appName} API!`,
  });
});

// Mount routes with different prefixes
const appRouter = app.route('/', routes);

app.use(docsAuthMiddleware()).get(
  '/openapi',
  openAPIRouteHandler(app, {
    documentation: {
      info: {
        title: `${config.appName} API`,
        version: '1.0.0',
      },
      servers: [
        {
          url: config.apiUrl,
          description: `${config.appName} API server`,
        },
      ],
    },
  }),
);

app.use(docsAuthMiddleware()).get(
  '/docs',
  Scalar({
    theme: 'kepler',
    url: '/openapi',
  }),
);

export type AppRouter = typeof appRouter;
