import type { BetterAuthOptions } from 'better-auth';

import { isProduction } from '../lib/utils';

export const rateLimit = {
  rateLimit: {
    /**
     * By default, rate limiting is only enabled on production.
     */
    enabled: isProduction,

    /**
     * Default window to use for rate limiting.
     * @default 10 seconds
     */
    // window: 10,

    /**
     * The default maximum number of requests allowed within the window.
     * @default 100 requests
     */
    // max: 100,

    /**
     * Custom rate limit rules to apply to specific paths.
     */
    // customRules: {
    //   "/sign-in/email": {
    //     window: 10,
    //     max: 3,
    //   },
    //   "/two-factor/*": async (request) => {
    //     // custom function to return rate limit window and max
    //     return {
    //       window: 10,
    //       max: 3,
    //     }
    //   }
    // },

    /**
     * Storage configuration.
     * By default, rate limiting is stored in memory. If you passed a secondary storage,
     * rate limiting will be stored in the secondary storage.
     * @default "memory"
     */
    storage: 'database',

    /**
     * If database is used as storage, the name of the table to use for rate limiting.
     * @default "rateLimit"
     */
    // modelName: 'rateLimit',

    /**
     * Custom field names for the rate limit table
     */
    // fields: {
    //   userId: "user_id"
    // },

    /**
     * custom storage configuration.
     * NOTE: If custom storage is used storage is ignored.
     */
    // customStorage: {
    //   get: async (key) => {
    //     // TODO: Implement custom storage get
    //   },
    //   set: async (key, value) => {
    //     // TODO: Implement custom storage set
    //   },
    // },
  },
} satisfies BetterAuthOptions;
