import { betterAuth } from 'better-auth';

import { account } from './options/account';
import { advanced } from './options/advanced';
import { databaseHooks } from './options/database-hooks';
import { emailAndPassword } from './options/email-password';
import { emailVerification } from './options/email-verification';
import { onAPIError } from './options/error';
import { generals } from './options/generals';
import { hooks } from './options/hooks';
import { plugins } from './options/plugins';
import { rateLimit } from './options/rate-limit';
import { session } from './options/session';
import { user } from './options/user';
import { verification } from './options/verification';

export const auth = betterAuth({
  /**
   * General options.
   */
  ...generals,

  /**
   * Email verification configuration.
   */
  ...emailVerification,
  /**
   * Email and password authentication.
   */
  ...emailAndPassword,

  /**
   * List of Better Auth plugins.
   */
  ...plugins,

  /**
   * User configuration.
   */
  ...user,

  /**
   * Session configuration.
   */
  ...session,

  /**
   * Account configuration.
   */
  ...account,

  /**
   * Verification configuration.
   */
  ...verification,

  /**
   * Rate limiting configuration.
   */
  ...rateLimit,

  /**
   * Advanced options.
   */
  ...advanced,

  /**
   * Hooks.
   */
  ...hooks,

  /**
   * Database hooks.
   */
  ...databaseHooks,

  /**
   * API error handling.
   */
  ...onAPIError,
});
