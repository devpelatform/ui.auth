import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nextCookies } from 'better-auth/next-js';
import {
  admin,
  anonymous,
  apiKey,
  captcha,
  deviceAuthorization,
  emailOTP,
  haveIBeenPwned,
  lastLoginMethod,
  magicLink,
  multiSession,
  oneTap,
  organization,
  phoneNumber,
  twoFactor,
  username,
} from 'better-auth/plugins';
import { passkey } from 'better-auth/plugins/passkey';

import { config } from './config';
import { db, schema } from './db';

export const auth = betterAuth({
  appName: config.appName,
  baseURL: config.appUrl,
  trustedOrigins: [config.appUrl],
  secret: process.env.BETTER_AUTH_SECRET || process.env.AUTH_SECRET,
  database: drizzleAdapter(db, {
    provider: 'pg',
    usePlural: true,
    schema,
    // debugLogs: isDevelopment,
  }),
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
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  plugins: [
    anonymous(),
    emailOTP({
      async sendVerificationOTP({ email, otp, type }, request) {
        console.info(email, otp, type);
      },
    }),
    magicLink({
      disableSignUp: true,
      sendMagicLink: async ({ email, url, token }) => {
        console.info('Sending email', email, url, token);
      },
    }),
    oneTap(),
    passkey(),
    phoneNumber(),
    twoFactor(),
    username({
      minUsernameLength: 5,
    }),
    admin(),
    apiKey({
      enableMetadata: true,
    }),
    organization(),
    captcha({
      provider: 'cloudflare-turnstile',
      secretKey: process.env.TURNSTILE_SECRET_KEY!,
    }),
    deviceAuthorization(),
    haveIBeenPwned(),
    lastLoginMethod({
      storeInDatabase: true,
    }),
    multiSession(),
    nextCookies(),
  ],
  user: {
    changeEmail: {
      enabled: true,
    },
    deleteUser: {
      enabled: true,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ['google', 'github'],
    },
  },
  advanced: {
    database: {
      generateId: false,
    },
  },
  onAPIError: {
    onError(error, ctx) {
      console.error(error, { ctx });
    },
  },
});
