/* @private */

import {
  anonymousClient,
  apiKeyClient,
  deviceAuthorizationClient,
  emailOTPClient,
  genericOAuthClient,
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

export type AnyAuthClient = Omit<ReturnType<typeof createAuthClient>, 'signUp' | 'getSession'>;

export const authClient = createAuthClient({
  plugins: [
    // Authentication
    anonymousClient(),
    emailOTPClient(),
    magicLinkClient(),
    genericOAuthClient(),
    oneTapClient({
      clientId: '',
    }),
    passkeyClient(),
    phoneNumberClient(),
    twoFactorClient(),
    usernameClient(),

    // Authorization
    apiKeyClient(),
    organizationClient(),

    // Utility
    deviceAuthorizationClient(),
    lastLoginMethodClient(),
    multiSessionClient(),
  ],
});

export type AuthClient = typeof authClient;

export type Session = AuthClient['$Infer']['Session']['session'];
export type User = AuthClient['$Infer']['Session']['user'];
