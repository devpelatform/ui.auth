import type { MiddlewareHandler } from 'hono';

import { isProduction } from '@pelatform/utils';

export const docsAuthMiddleware = (): MiddlewareHandler => {
  return async (c, next) => {
    // Skip auth in development if DOCS_AUTH_DISABLED is set
    if (!isProduction && process.env.API_DOCS_AUTH_DISABLED === 'true') {
      return next();
    }

    const authorization = c.req.header('Authorization');

    if (!authorization || !authorization.startsWith('Basic ')) {
      return new Response('Unauthorized', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="API Documentation"',
          'Content-Type': 'text/plain',
        },
      });
    }

    try {
      // Extract credentials from Basic auth header
      const base64Credentials = authorization.slice(6); // Remove 'Basic '
      const credentials = atob(base64Credentials);
      const [username, password] = credentials.split(':');

      // Get credentials from environment variables
      const validUsername = process.env.API_DOCS_AUTH_USERNAME || 'admin';
      const validPassword = process.env.API_DOCS_AUTH_PASSWORD || 'admin123';

      // Validate credentials
      if (username !== validUsername || password !== validPassword) {
        return new Response('Invalid credentials', {
          status: 401,
          headers: {
            'WWW-Authenticate': 'Basic realm="API Documentation"',
            'Content-Type': 'text/plain',
          },
        });
      }

      // Credentials are valid, proceed to next middleware
      return next();
    } catch (error) {
      console.error('Error in docs auth middleware:', error);
      return new Response('Authentication error', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="API Documentation"',
          'Content-Type': 'text/plain',
        },
      });
    }
  };
};
