import {
  adminClient,
  anonymousClient,
  apiKeyClient,
  deviceAuthorizationClient,
  emailOTPClient,
  inferAdditionalFields,
  inferOrgAdditionalFields,
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

// import { polarClient } from '@polar-sh/better-auth';

import type { auth } from './auth';

export const authClient = createAuthClient({
  plugins: [
    // Authentication
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

    // Authorization
    adminClient(),
    apiKeyClient(),
    organizationClient({
      schema: inferOrgAdditionalFields<typeof auth>(),
    }),

    // Utility
    // customSessionClient<typeof auth>(),
    deviceAuthorizationClient(),
    inferAdditionalFields<typeof auth>(),
    lastLoginMethodClient(),
    multiSessionClient(),

    // 3rd party
    // polarClient(),
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

// export const {
//   signUp,
//   signIn,
//   signOut,
//   useSession,
//   organization,
//   useListOrganizations,
//   useActiveOrganization,
//   emailOtp,
//   checkout,
// } = authClient;
