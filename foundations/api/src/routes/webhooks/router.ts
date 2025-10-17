import { Hono } from 'hono';
import { describeRoute } from 'hono-openapi';

export const webhooksRouter = new Hono()
  .get(
    '/',
    describeRoute({
      tags: ['Webhooks'],
      summary: 'List webhooks',
      description: 'Returns a list of all registered webhooks',
      responses: { 200: { description: 'OK' } },
    }),
    () => new Response('OK'),
  )
  .post(
    '/payments',
    describeRoute({
      tags: ['Webhooks'],
      summary: 'Handle payments webhook',
      description: 'Handles payments webhooks from the payment provider',
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                event: { type: 'string' },
                data: { type: 'object' },
              },
            },
          },
        },
      },
      responses: { 200: { description: 'OK' } },
    }),
    async (c) => {
      const body = await c.req.json();
      return c.json({ message: 'Webhook received', body });
    },
  );
