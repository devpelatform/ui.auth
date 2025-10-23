/* @private */

import type { AccountViewPaths } from '@/lib/view-paths';
import type { AuthClient, SocialProvider } from './auth';
import type { Provider } from './components';
import type { PasswordValidation } from './generals';

export type AccountOptionsProps = {
  basePath?: string;
  fields: string[];
  viewPaths?: Partial<AccountViewPaths>;
};

export type AccountOptions = {
  /**
   * Base path for account-scoped views
   * @default "/account"
   */
  basePath: string;
  /**
   * Array of fields to show in Account Settings
   * @default ["image", "name"]
   */
  fields: string[];
  /**
   * Customize account view paths
   */
  viewPaths: AccountViewPaths;
};

export type AvatarOptions = {
  /**
   * Upload an avatar image and return the URL string
   * @remarks `(file: File) => Promise<string>`
   */
  upload?: (file: File) => Promise<string | undefined | null>;
  /**
   * Delete a previously uploaded avatar image from your storage/CDN
   * @remarks `(url: string) => Promise<void>`
   */
  delete?: (url: string) => Promise<void>;
  /**
   * Avatar size for resizing
   * @default 128 (or 256 if upload is provided)
   */
  size: number;
  /**
   * File extension for avatar uploads
   * @default "png"
   */
  extension: string;
};

export type CaptchaOptions = {
  /**
   * Captcha site key
   */
  siteKey: string;
  /**
   * Captcha provider type
   */
  provider:
    | 'cloudflare-turnstile'
    | 'google-recaptcha-v2-checkbox'
    | 'google-recaptcha-v2-invisible'
    | 'google-recaptcha-v3'
    | 'hcaptcha';
  /**
   * Hide the captcha badge
   * @default false
   */
  hideBadge?: boolean;
  /**
   * Use recaptcha.net domain instead of google.com
   * @default false
   */
  recaptchaNet?: boolean;
  /**
   * Enable enterprise mode for Google reCAPTCHA
   * @default false
   */
  enterprise?: boolean;
  /**
   * Overrides the default array of paths where captcha validation is enforced
   * @default ["/sign-up/email", "/sign-in/email", "/forget-password"]
   */
  endpoints?: string[];
};

export type CredentialsOptions = {
  /**
   * Enable or disable the Confirm Password input
   * @default false
   */
  confirmPassword?: boolean;
  /**
   * Enable or disable Forgot Password flow
   * @default true
   */
  forgotPassword?: boolean;
  /**
   * Customize the password validation
   */
  passwordValidation?: PasswordValidation;
  /**
   * Enable or disable Remember Me checkbox
   * @default false
   */
  rememberMe?: boolean;
  /**
   * Enable or disable Username support
   * @default false
   */
  username?: boolean;
};

export type DeleteUserOptions = {
  /**
   * Enable or disable email verification for account deletion
   * @default undefined
   */
  verification?: boolean;
};

export type GenericOAuthOptions = {
  /**
   * Custom OAuth Providers
   * @default []
   */
  providers: Provider[];
  /**
   * Custom generic OAuth sign in function
   */
  signIn?: (params: Parameters<AuthClient['signIn']['oauth2']>[0]) => Promise<unknown>;
};

export type GravatarOptions = {
  /**
   * Default image type or URL
   * Options: '404', 'mp', 'identicon', 'monsterid', 'wavatar', 'retro', 'robohash', 'blank', or custom URL
   */
  d?: string;
  /**
   * Image size in pixels (1-2048)
   */
  size?: number;
  /**
   * Whether to append .jpg extension to the hash
   * @default false
   */
  jpg?: boolean;
  /**
   * Force default image even if user has Gravatar
   * @default false
   */
  forceDefault?: boolean;
};

export type SignUpOptions = {
  /**
   * Array of fields to show in Sign Up form
   * @default ["name"]
   */
  fields?: string[];
};

export type SocialOptions = {
  /**
   * Array of Social Providers to enable
   * @remarks `SocialProvider[]`
   */
  providers: SocialProvider[];
  /**
   * Custom social sign in function
   */
  signIn?: (params: Parameters<AuthClient['signIn']['social']>[0]) => Promise<unknown>;
};
