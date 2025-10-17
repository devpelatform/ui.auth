import type { BetterAuthOptions } from 'better-auth';

import { config } from '@repo/config';
import { createEmailLog, updateUserLastPasswordChange } from '@repo/db';
import { sendEmail } from '@repo/mail';
import { getLocaleFromRequest, isDevelopment } from '../lib/utils';

export const emailAndPassword = {
  emailAndPassword: {
    /**
     * Enable email and password authentication.
     * @default false
     */
    enabled: true,

    /**
     * Disable email and password sign up.
     * @default false
     */
    disableSignUp: !config.auth.signup,

    /**
     * Require email verification before a session can be created for the user.
     */
    requireEmailVerification: config.auth.signup,

    /**
     * The maximum length of the password.
     * @default 128
     */
    // maxPasswordLength: 128,

    /**
     * The minimum length of the password.
     * @default 8
     */
    // minPasswordLength: 8,

    /**
     * Send reset password.
     */
    sendResetPassword: async ({ user, url, token }, request) => {
      const locale = getLocaleFromRequest(request);
      const templateId = 'forgotPassword';

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
     * Number of seconds the reset password token is valid for.
     * @default 60 * 60 seconds (1 hour)
     */
    // resetPasswordTokenExpiresIn: 60 * 60,

    /**
     * A callback function that is triggered when a user's password is changed successfully.
     */
    onPasswordReset: async ({ user }, request) => {
      await updateUserLastPasswordChange(user.id);
    },

    /**
     * Password hashing and verification.
     */
    // password: {
    //   hash: async (password) => {
    //     // TODO: Add logic to hash password
    //   },
    //   verify: async ({ hash, password }) => {
    //     // TODO: Add logic to verify password
    //   },
    // },

    /**
     * Automatically sign in the user after sign up.
     * @default true
     */
    autoSignIn: !config.auth.signup,

    /**
     * Whether to revoke all other sessions when resetting password.
     * @default false
     */
    // revokeSessionsOnPasswordReset: false,
  },
} satisfies BetterAuthOptions;
