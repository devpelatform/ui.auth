import type { BetterAuthOptions } from 'better-auth';

export const account = {
  account: {
    /**
     * The model name.
     * @default "account"
     */
    // modelName: "account",

    /**
     * Map fields.
     */
    // fields: {
    //   userId: "user_id"
    // },

    /**
     * When enabled (true), the user account data (accessToken, idToken, refreshToken, etc.)
     * will be updated on sign in with the latest data from the provider.
     * @default true
     */
    // updateAccountOnSignIn: true,

    /**
     * Configuration for account linking.
     */
    accountLinking: {
      /**
       * Enable account linking.
       * @default true
       */
      enabled: true,

      /**
       * List of trusted providers.
       */
      trustedProviders: ['google', 'github'],

      /**
       * If enabled (true), this will allow users to manually linking accounts with different email addresses than the main user.
       * ⚠️ Warning: enabling this might lead to account takeovers, so proceed with caution.
       * @default false
       */
      // allowDifferentEmails: false,

      /**
       * If enabled (true), this will allow users to unlink all accounts.
       * @default false
       */
      // allowUnlinkingAll: false,

      /**
       * If enabled (true), this will update the user information based on the newly linked account
       * @default false
       */
      // updateUserInfoOnLink: false,
    },

    /**
     * Encrypt OAuth tokens.
     * By default, OAuth tokens (access tokens, refresh tokens, ID tokens) are stored in plain text in the database.
     * This poses a security risk if your database is compromised, as attackers could gain access to user accounts on external services.
     * When enabled, tokens are encrypted using AES-256-GCM before storage, providing protection against:
     * - Database breaches and unauthorized access to raw token data
     * - Internal threats from database administrators or compromised credentials
     * - Token exposure in database backups and logs
     * @default false
     */
    // encryptOAuthTokens: false,
  },
} satisfies BetterAuthOptions;
