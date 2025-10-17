import type { BetterAuthOptions } from 'better-auth';

import { config } from '@repo/config';
import { createEmailLog } from '@repo/db';
import { sendEmail } from '@repo/mail';
import { getLocaleFromRequest, isDevelopment } from '../lib/utils';

export const user = {
  user: {
    /**
     * The model name.
     * @default "user"
     */
    // modelName: "user",

    /**
     * Map fields.
     */
    // fields: {
    //   email: "emailAddress",
    //   name: "fullName"
    // },

    /**
     * Additional fields.
     */
    additionalFields: {
      status: {
        type: 'string',
        input: false,
        required: true,
        defaultValue: 'ACTIVE',
      },
      lastPasswordChange: {
        type: 'date',
        input: false,
        required: false,
      },
      lastSignInAt: {
        type: 'date',
        input: false,
        required: false,
      },
      defaultWorkspace: {
        type: 'string',
        input: false,
        required: false,
      },
      metadata: {
        type: 'json',
        input: false,
        required: false,
      },
      isTrashed: {
        type: 'boolean',
        input: false,
        required: false,
        defaultValue: false,
      },
      isProtected: {
        type: 'boolean',
        input: false,
        required: false,
        defaultValue: false,
      },
      deletedAt: {
        type: 'date',
        input: false,
        required: false,
      },
    },

    /**
     * Changing email configuration.
     */
    changeEmail: {
      /**
       * Enable changing email.
       * @default false
       */
      enabled: true,

      /**
       * Send a verification email when the user changes their email.
       */
      sendChangeEmailVerification: async ({ user, newEmail, url, token }, request) => {
        const locale = getLocaleFromRequest(request);
        const templateId = 'changeEmail';

        const userId = user.id;
        const email = user.email;
        const name = user.name || email;
        const expiresIn = locale === 'id' ? '1 jam' : '1 hour';

        const sending = await sendEmail({
          locale,
          templateId,
          to: email,
          context: {
            name,
            url,
            expiresIn,
            email,
            newEmail,
          },
        });

        const metadata = {
          messageId: sending.success ? sending.messageId : undefined,
          error: !sending.success ? sending.error : undefined,
          locale,
          templateId,
          token,
          url,
          userId,
          email,
          newEmail,
          name,
          expiresIn,
        };

        if (isDevelopment) {
          console.info('Sending email', metadata);
        }

        if (config.email.databaseLog) {
          await createEmailLog({ email, metadata });
        }
      },
    },

    /**
     * User deletion configuration.
     */
    deleteUser: {
      /**
       * Enable user deletion.
       */
      enabled: true,

      /**
       * Send a verification email when the user deletes their account.
       */
      // sendDeleteAccountVerification: async ({ user, url, token }, request) => {
      //   // TODO: send email
      // },

      /**
       * A function that is called before a user is deleted.
       *
       * to interrupt with error you can throw `APIError`
       */
      // beforeDelete: async (user, request) => {
      //   // TODO: check if user is protected
      // },

      /**
       * A function that is called after a user is deleted.
       *
       * This is useful for cleaning up user data
       */
      // afterDelete: async (user, request) => {
      //   // TODO: clean up user data
      // },

      /**
       * The expiration time for the delete token.
       * @default 60 * 60 * 24 seconds (1 day)
       */
      // deleteTokenExpiresIn: 60 * 60 * 24,
    },
  },
} satisfies BetterAuthOptions;
