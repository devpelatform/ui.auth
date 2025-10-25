import {
  adminClient,
  anonymousClient,
  apiKeyClient,
  deviceAuthorizationClient,
  emailOTPClient,
  inferAdditionalFields,
  lastLoginMethodClient,
  magicLinkClient,
  multiSessionClient,
  oneTapClient,
  organizationClient,
  passkeyClient,
  phoneNumberClient,
  twoFactorClient,
  usernameClient,
} from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

import type { auth } from './auth';

export const authClient = createAuthClient({
  plugins: [
    anonymousClient(),
    emailOTPClient(),
    magicLinkClient(),
    oneTapClient({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      promptOptions: {
        maxAttempts: 1,
      },
    }),
    passkeyClient(),
    phoneNumberClient(),
    twoFactorClient(),
    usernameClient(),
    adminClient(),
    apiKeyClient(),
    organizationClient(),
    deviceAuthorizationClient(),
    inferAdditionalFields<typeof auth>(),
    lastLoginMethodClient(),
    multiSessionClient(),
  ],
  fetchOptions: {
    onError: async (context) => {
      const { response } = context;
      if (response.status === 429) {
        const retryAfter = response.headers.get('X-Retry-After');
        console.log(`Rate limit exceeded. Retry after ${retryAfter} seconds`);
      }
    },
  },
});
