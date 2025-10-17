import type { BetterAuthOptions } from 'better-auth';

import { config } from '@repo/config';
import { createEmailLog } from '@repo/db';
import { sendEmail } from '@repo/mail';
import { getLocaleFromRequest, isDevelopment } from '../lib/utils';

export const emailVerification = {
  emailVerification: {
    /**
     * Send a verification email.
     */
    sendVerificationEmail: async ({ user, url, token }, request) => {
      const locale = getLocaleFromRequest(request);
      const templateId = 'confirmSignup';

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

    /**
     * Send a verification email automatically after sign up.
     * @default false
     */
    sendOnSignUp: config.auth.signup,

    /**
     * Send a verification email automatically on sign in when the user's email is not verified.
     * @default false
     */
    // sendOnSignIn: false,

    /**
     * Auto signin the user after they verify their email.
     */
    // autoSignInAfterVerification: false,

    /**
     * Number of seconds the verification token is valid for.
     * @default 60 * 60 seconds (1 hour)
     */
    // expiresIn: 60 * 60,

    /**
     * A function that is called when a user verifies their email.
     */
    // onEmailVerification: async (user, request) => {
    //   // TODO: Add logic to verify user email
    // },

    /**
     * A function that is called when a user's email is updated to verified.
     */
    // afterEmailVerification: async (user, request) => {
    //   // TODO: Add logic to update user email to verified
    // },
  },
} satisfies BetterAuthOptions;
