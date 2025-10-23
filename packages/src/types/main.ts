import type { ReactNode } from 'react';

import type { AuthLocalization, authLocalization } from '../lib/localization/index';
import type { AuthViewPaths } from '../lib/view-paths';
import type { AnyAuthClient, AuthClient } from './auth';
import type { AdditionalFields, Link, RenderToast } from './components';
import type {
  AccountOptions,
  AccountOptionsProps,
  AvatarOptions,
  CaptchaOptions,
  CredentialsOptions,
  DeleteUserOptions,
  GenericOAuthOptions,
  GravatarOptions,
  SignUpOptions,
  SocialOptions,
} from './options';
import type { AuthQueryOptions } from './query';

export type AuthUIOptions = {
  /****************************************
   ********** Main Configuration
   *****************************************/
  /**
   * AuthClient instance
   * @required
   */
  authClient: AuthClient;
  /**
   * Additional fields for users
   */
  additionalFields?: AdditionalFields;
  /**
   * Avatar configuration
   * @default undefined
   */
  avatar?: AvatarOptions;
  /**
   * Base path for the auth views
   * @default "/auth"
   */
  basePath: string;
  /**
   * Front end base URL for auth API callbacks
   * @default ""
   */
  baseURL?: string;
  /**
   * Enable or disable user change email support
   * @default true
   */
  changeEmail?: boolean;
  /**
   * User Account deletion configuration
   * @default undefined
   */
  deleteUser?: DeleteUserOptions;
  /**
   * Display User ID
   * @default false
   */
  displayId?: boolean;
  /**
   * Show Verify Email card for unverified emails
   */
  emailVerification?: boolean;
  /**
   * Freshness age for Session data
   * @default 60 * 60 * 24
   */
  freshAge: number;
  /**
   * Gravatar configuration
   * @default undefined
   */
  gravatar?: boolean | GravatarOptions;
  /**
   * Custom Link component for navigation
   * @default <a>
   */
  Link: Link;
  /**
   * Customize the Localization strings
   */
  localization: typeof authLocalization;
  /**
   * Navigate to a new URL
   * @default window.location.href
   */
  navigate: (href: string) => void;
  /**
   * Whether the name field should be required
   * @default true
   */
  nameRequired?: boolean;
  /**
   * Called whenever the Session changes
   */
  onSessionChange?: () => void | Promise<void>;
  /**
   * Forces tanstack to refresh the Session on the auth callback page
   * @default false
   */
  persistClient?: boolean;
  /**
   * Default redirect URL after authenticating
   * @default "/"
   */
  redirectTo: string;
  /**
   * Replace the current URL
   * @default navigate
   */
  replace: (href: string) => void;
  /**
   * Sign Up configuration
   * @default undefined
   */
  signUp?: SignUpOptions;
  /**
   * Render custom Toasts
   * @default Sonner
   */
  toast: RenderToast;
  /**
   * Customize the paths for the auth views
   * @default authViewPaths
   */
  viewPaths: AuthViewPaths;

  /****************************************
   ********** Plugins Configuration
   *****************************************/
  /**
   * API Key plugin configuration
   * @default undefined
   */
  apiKey?:
    | boolean
    | {
        // Prefix for API Keys
        prefix?: string;
        // Metadata for API Keys
        metadata?: Record<string, unknown>;
      };
  /**
   * Captcha configuration
   * @default undefined
   */
  captcha?: CaptchaOptions;
  /**
   * Enable or disable Credentials support
   * @default undefined
   */
  credentials?: CredentialsOptions;
  /**
   * Enable or disable Email OTP support
   * @default false
   */
  emailOTP?: boolean;
  /**
   * Generic OAuth provider configuration
   * @default undefined
   */
  genericOAuth?: GenericOAuthOptions;
  /**
   * Enable or disable Magic Link support
   * @default false
   */
  magicLink?: boolean;
  /**
   * Enable or disable Multi Session support
   * @default false
   */
  multiSession?: boolean;
  /**
   * Enable or disable One Tap support
   * @default false
   */
  oneTap?: boolean;
  /**
   * Enable or disable organization support
   * @default false
   */
  organization?: boolean;
  /**
   * Enable or disable Passkey support
   * @default false
   */
  passkey?: boolean;
  /**
   * Social provider configuration
   */
  social?: SocialOptions;
  /**
   * Enable or disable two-factor authentication support
   * @default undefined
   */
  twoFactor?: ('otp' | 'totp')[];

  /****************************************
   ********** Account Configuration
   *****************************************/
  /**
   * Account configuration
   * @default undefined
   */
  account?: AccountOptions;
};

export type AuthUIProviderProps = {
  children: ReactNode;
  authClient: AnyAuthClient;
  account?: boolean | Partial<AccountOptionsProps>;
  avatar?: boolean | Partial<AvatarOptions>;
  credentials?: boolean | CredentialsOptions;
  deleteUser?: boolean | DeleteUserOptions;
  localization?: AuthLocalization;
  signUp?: boolean | SignUpOptions;
  toast?: RenderToast;
  viewPaths?: Partial<AuthViewPaths>;
} & Partial<
  Omit<
    AuthUIOptions,
    | 'authClient'
    | 'account'
    | 'avatar'
    | 'credentials'
    | 'deleteUser'
    | 'localization'
    | 'signUp'
    | 'toast'
    | 'viewPaths'
  >
> &
  Partial<AuthQueryOptions>;
