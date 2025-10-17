import type { BetterAuthOptions } from 'better-auth';

export const verification = {
  verification: {
    /**
     * The model name.
     * @default "verification"
     */
    // modelName: "verification",
    /**
     * Map fields.
     */
    // fields: {
    //   userId: "user_id"
    // },
    /**
     * disable cleaning up expired values when a verification value is fetched.
     */
    // disableCleanup: false,
  },
} satisfies BetterAuthOptions;
