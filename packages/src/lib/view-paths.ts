export const authViewPaths = {
  /** @default "callback" */
  CALLBACK: 'callback',
  /** @default "email-otp" */
  EMAIL_OTP: 'email-otp',
  /** @default "forgot-password" */
  FORGOT_PASSWORD: 'forgot-password',
  /** @default "magic-link" */
  MAGIC_LINK: 'magic-link',
  /** @default "recover-account" */
  RECOVER_ACCOUNT: 'recover-account',
  /** @default "reset-password" */
  RESET_PASSWORD: 'reset-password',
  /** @default "sign-in" */
  SIGN_IN: 'sign-in',
  /** @default "sign-out" */
  SIGN_OUT: 'sign-out',
  /** @default "sign-up" */
  SIGN_UP: 'sign-up',
  /** @default "two-factor" */
  TWO_FACTOR: 'two-factor',
  /** @default "accept-invitation" */
  ACCEPT_INVITATION: 'accept-invitation',
};

export type AuthViewPaths = typeof authViewPaths;
export type AuthViewPath = keyof AuthViewPaths;

// Account-scoped views (signed-in user)
export const accountViewPaths = {
  /** @default "settings" */
  SETTINGS: 'settings',
  /** @default "security" */
  SECURITY: 'security',
  /** @default "api-keys" */
  API_KEYS: 'api-keys',
  /** @default "organizations" */
  ORGANIZATIONS: 'organizations',
};

export type AccountViewPaths = typeof accountViewPaths;
export type AccountViewPath = keyof AccountViewPaths;

// Organization-scoped views
export const organizationViewPaths = {
  /** @default "settings" */
  SETTINGS: 'settings',
  /** @default "members" */
  MEMBERS: 'members',
  /** @default "api-keys" */
  API_KEYS: 'api-keys',
};

export type OrganizationViewPaths = typeof organizationViewPaths;
export type OrganizationViewPath = keyof OrganizationViewPaths;

export function getViewByPath<T extends object>(viewPaths: T, path?: string) {
  for (const key in viewPaths) {
    if (viewPaths[key] === path) {
      return key;
    }
  }
}
