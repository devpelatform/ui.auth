import type { BetterAuthOptions } from 'better-auth';

import { config } from '@repo/config';

export const session = {
  session: {
    /**
     * The model name.
     * @default "session"
     */
    // modelName: "session",

    /**
     * Map fields.
     */
    // fields: {
    //   userId: "user_id"
    // },

    /**
     * Expiration time for the session token.
     * @default 60 * 60 * 24 * 7 seconds (7 days)
     */
    expiresIn: config.auth.sessionCookieMaxAge, // 30 days

    /**
     * How often the session should be refreshed.
     * @default 60 * 60 * 24 seconds (1 day)
     */
    // updateAge: 60 * 60 * 24,

    /**
     * Disable session refresh so that the session is not updated regardless of the `updateAge` option.
     * @default false
     */
    // disableSessionRefresh: false,

    /**
     * Additional fields.
     */
    // additionalFields: {
    //   customField: {
    //     type: "string",
    //   }
    // },

    /**
     * By default if secondary storage is provided the session is stored in the secondary storage.
     * @default false
     */
    // storeSessionInDatabase: false,

    /**
     * By default, sessions are deleted from the database when secondary storage is provided when session is revoked.
     * @default false
     */
    // preserveSessionInDatabase: false,

    /**
     * Enable caching session in cookie.
     */
    // cookieCache: {
    //   /**
    //    * Max age of the cookie.
    //    * @default 60 * 5 seconds (5 minutes)
    //    */
    //   // maxAge: 60 * 5,
    //   /**
    //    * Enable caching session in cookie.
    //    * @default false
    //    */
    //   // enabled: false,
    // },

    /**
     * The age of the session to consider it fresh.
     * This is used to check if the session is fresh for sensitive operations. (e.g. deleting an account)
     * If the session is not fresh, the user should be prompted to sign in again.
     * If set to 0, the session will be considered fresh every time. (⚠︎ not recommended)
     * @default 60 * 60 * 24 seconds (1 day)
     */
    // freshAge: 0, // Disable freshness check
  },
} satisfies BetterAuthOptions;
