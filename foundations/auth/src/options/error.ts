import type { BetterAuthOptions } from 'better-auth';

export const onAPIError = {
  onAPIError: {
    /**
     * Throw an error on API error.
     * @default false
     */
    // throw: false,

    /**
     * Custom error handler.
     */
    onError(error, ctx) {
      console.error(error, { ctx });
    },

    /**
     * The URL to redirect to on error.
     * @default - "/api/auth/error"
     */
    // errorURL: "/api/auth/error",
  },
} satisfies BetterAuthOptions;
