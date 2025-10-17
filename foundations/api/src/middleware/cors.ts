import { cors } from 'hono/cors';

import { config } from '@repo/config';

export const corsDefaultMiddleware = cors({
  origin: '*', // Configure this based on your needs
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['POST', 'GET', 'OPTIONS'],
  exposeHeaders: ['Content-Length'],
  maxAge: 600,
  credentials: true,
});

export const corsMiddleware = cors({
  origin: [config.appUrl], // Configure this based on your needs
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['POST', 'GET', 'PUT', 'OPTIONS'],
  exposeHeaders: ['Content-Length'],
  maxAge: 600,
  credentials: true,
});
