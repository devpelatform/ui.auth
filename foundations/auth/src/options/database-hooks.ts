import type { BetterAuthOptions } from 'better-auth';

import { config } from '@repo/config';
import { createEmailLog, getLastActiveOrg, updateUserLastSignInAt } from '@repo/db';
import { sendEmail } from '@repo/mail';
import { getLocaleFromRequest, isDevelopment } from '../lib/utils';

export const databaseHooks = {
  databaseHooks: {
    /**
     * User hooks.
     */
    user: {
      create: {
        // before: async (user, context) => {
        //   // TODO: Add custom logic before user creation
        // },
        after: async (user, context) => {
          const request = context?.request || undefined;
          const locale = getLocaleFromRequest(request) || 'en';
          const templateId = 'welcome';

          const url = config.appUrl;
          const userId = user.id || undefined;
          const email = user.email;
          const name = user.name || email;

          const sending = await sendEmail({
            locale,
            templateId,
            to: email,
            context: {
              name,
              url,
            },
          });

          const metadata = {
            messageId: sending.success ? sending.messageId : undefined,
            error: !sending.success ? sending.error : undefined,
            locale,
            templateId,
            url,
            userId,
            email,
            name,
          };

          if (isDevelopment) {
            console.info('Sending email', metadata);
          }

          if (config.email.databaseLog) {
            await createEmailLog({ email, metadata });
          }
        },
      },
      update: {
        // before: async (user, context) => {
        //   // TODO: Add custom logic before user update
        // },
        // after: async (user, context) => {
        //   // TODO: Add custom logic after user update
        // }
      },
    },

    /**
     * Session hooks.
     */
    session: {
      create: {
        before: async (session) => {
          try {
            const organization = await getLastActiveOrg(session.userId);
            return {
              data: {
                ...session,
                activeOrganizationId: organization?.id || null,
              },
            };
          } catch (_error) {
            // If there's an error, create the session without an active org
            return { data: session };
          }
        },
        after: async (session) => {
          // update user last sign-in at
          await updateUserLastSignInAt(session.userId);
        },
      },
      update: {
        // before: async (session, context) => {
        //   // TODO: Add custom logic before session update
        // },
        // after: async (session, context) => {
        //   // TODO: Add custom logic after session update
        // }
      },
    },

    /**
     * Account hooks.
     */
    account: {
      create: {
        // before: async (account, context) => {
        //   // TODO: Add custom logic before account creation
        // },
        // after: async (account, context) => {
        //   // TODO: Add custom logic after account creation
        // }
      },
      update: {
        // before: async (account, context) => {
        //   // TODO: Add custom logic before account update
        // },
        // after: async (account, context) => {
        //   // TODO: Add custom logic after account update
        // }
      },
    },

    /**
     * Verification hooks.
     */
    verification: {
      create: {
        // before: async (verification, context) => {
        //   // TODO: Add custom logic before verification creation
        // },
        // after: async (verification, context) => {
        //   // TODO: Add custom logic after verification creation
        // }
      },
      update: {
        // before: async (verification, context) => {
        //   // TODO: Add custom logic before verification update
        // },
        // after: async (verification, context) => {
        //   // TODO: Add custom logic after verification update
        // }
      },
    },
  },
} satisfies BetterAuthOptions;
