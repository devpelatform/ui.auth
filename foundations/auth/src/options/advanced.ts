import type { BetterAuthOptions } from 'better-auth';

export const advanced = {
  advanced: {
    // /**
    //  * Ip address configuration.
    //  */
    // ipAddress: {
    //   /**
    //    * List of headers to use for ip address.
    //    * Ip address is used for rate limiting and session tracking.
    //    */
    //   ipAddressHeaders: ["x-client-ip", "x-forwarded-for"],

    //   /**
    //    * Disable ip tracking.
    //    */
    //   disableIpTracking: false
    // },

    /**
     * Use secure cookies.
     * @default false
     */
    // useSecureCookies: false,

    /**
     * Disable trusted origins check.
     */
    // disableCSRFCheck: false,

    // /**
    //  * Configure cookies to be cross subdomains.
    //  */
    // crossSubDomainCookies: {
    //   /**
    //    * Enable cross subdomain cookies.
    //    */
    //   enabled: false,

    //   /**
    //    * Additional cookies to be shared across subdomains.
    //    */
    //   additionalCookies: ["custom_cookie"],

    //   /**
    //    * The domain to use for the cookies.
    //    * By default, the domain will be the root domain from the base URL.
    //    */
    //   domain: "example.com"
    // },

    /*
     * Allows you to change default cookie names and attributes.
     */
    // cookies: {
    //   session_token: {
    //     name: "custom_session_token",
    //     attributes: {
    //       httpOnly: true,
    //       secure: true
    //     }
    //   }
    // },
    // defaultCookieAttributes: {
    //   httpOnly: true,
    //   secure: true
    // },

    /**
     * Prefix for cookies. If a cookie name is provided in cookies config, this will be overridden.
     */
    // cookiePrefix: "myapp",

    /**
     * Database configuration.
     */
    database: {
      /**
       * The default number of records to return from the database when using the `findMany` adapter method.
       * @default 100
       */
      // defaultFindManyLimit: 100,

      /**
       * If your database auto increments number ids, set this to `true`.
       * @default false
       */
      // useNumberId: false,

      /**
       * Custom generateId function.
       * If not provided, random ids will be generated.
       * If set to false, the database's auto generated id will be used.
       */
      generateId: false,
    },
  },
} satisfies BetterAuthOptions;
