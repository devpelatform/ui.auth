import { Scalar } from '@scalar/hono-api-reference';
import { Hono } from 'hono';
import { openAPIRouteHandler } from 'hono-openapi';

import { auth } from '@repo/auth';
import { config } from '@repo/config';
import { mergeOpenApiSchemas } from './lib/openapi';
import { corsMiddleware } from './middleware/cors';
import { docsAuthMiddleware } from './middleware/docs';
import { loggerMiddleware } from './middleware/logger';
import { routes } from './web/index';

export const app = new Hono().basePath('/api');

app.use(loggerMiddleware);
app.use(corsMiddleware);

app.get('/', (c) => {
  return c.json({
    message: `Hello from ${config.appName} API!`,
  });
});

// Mount routes with different prefixes
const appRouter = app.route('/', routes);

app.use(docsAuthMiddleware()).get(
  '/app-openapi',
  openAPIRouteHandler(app, {
    documentation: {
      info: {
        title: `${config.appName} API`,
        version: '1.0.0',
      },
      servers: [
        {
          url: config.appUrl,
          description: `${config.appName} API server`,
        },
      ],
    },
  }),
);

app.get('/openapi', async (c) => {
  const authSchema = await auth.api.generateOpenAPISchema();
  const appSchema = await (app.request('/api/app-openapi') as Promise<Response>).then((res) =>
    res.json(),
  );
  const mergedSchema = mergeOpenApiSchemas({
    appSchema,
    // biome-ignore lint/suspicious/noExplicitAny: disable
    authSchema: authSchema as any,
  });

  return c.json(mergedSchema);
});

app.use(docsAuthMiddleware()).get(
  '/docs',
  Scalar({
    theme: 'kepler',
    url: '/api/openapi',
  }),
);

export type AppRouter = typeof appRouter;
