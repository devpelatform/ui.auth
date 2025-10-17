import type { BetterAuthOptions } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

import { config } from '@repo/config';
import { db, schema } from '@repo/db';

export const generals = {
  /**
   * The name of the application.
   */
  appName: config.appName,

  /**
   * Base URL for the Better Auth.
   */
  baseURL: config.appUrl,

  /**
   * Base path for the Better Auth.
   * @default "/api/auth"
   */
  // basePath: '/auth',

  /**
   * List of trusted origins.
   */
  trustedOrigins: [config.appUrl],

  /**
   * The secret to use for encryption, signing and hashing.
   */
  secret: process.env.BETTER_AUTH_SECRET || process.env.AUTH_SECRET,

  /**
   * Database configuration.
   */
  database: drizzleAdapter(db, {
    provider: 'pg',
    usePlural: true,
    schema,
    // debugLogs: isDevelopment,
  }),

  /**
   * Secondary storage configuration.
   */
  // secondaryStorage: {},

  /**
   * List of social providers.
   */
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    },
  },
} satisfies BetterAuthOptions;
