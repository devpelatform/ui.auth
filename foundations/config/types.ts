export type LocaleConfig = {
  code: string;
  name: string;
  shortName: string;
  direction: 'ltr' | 'rtl';
  flag: string;
  currency: string;
};

export type I18nConfig = {
  enabled: boolean;
  locales: { [locale: string]: LocaleConfig };
  defaultLocale: string;
  defaultCurrency: string;
  localeCookieName: string;
};

export type AuthConfig = {
  signup: boolean;
  password: boolean;
  magicLink: boolean;
  passkey: boolean;
  twoFactor: boolean;
  google: boolean;
  github: boolean;
  redirectAfterSignIn: string;
  redirectAfterLogout: string;
  sessionCookieMaxAge: number;
};

export type PathConfig = {
  auth: {
    ACCEPT_INVITATION: string;
    CALLBACK: string;
    EMAIL_OTP: string;
    FORGOT_PASSWORD: string;
    MAGIC_LINK: string;
    RECOVER_ACCOUNT: string;
    RESET_PASSWORD: string;
    SIGN_IN: string;
    SIGN_OUT: string;
    SIGN_UP: string;
    TWO_FACTOR: string;
  };
  account: {
    SETTINGS: string;
    SECURITY: string;
    API_KEYS: string;
    ORGANIZATIONS: string;
  };
  main: {
    ERROR: string;
    HOME: string;
    PRICING: string;
  };
  workspaces: {
    SETTINGS: string;
    MEMBERS: string;
    API_KEYS: string;
  };
};

export type EmailConfig = {
  provider: 'resend' | 'nodemailer';
  brandColor: string;
  companyName: string;
  logoUrl: string;
  supportEmail: string;
  websiteUrl: string;
  databaseLog: boolean;
};

// export type StorageConfig = {
//   bucket: string;
// };

export type UIConfig = {
  enableMultiThemes: boolean;
  defaultTheme: string;
  // saas: boolean;
  // marketing: boolean;
};

export type Config = {
  appName: string;
  appUrl: string;
  apiUrl: string;
  i18n: I18nConfig;
  auth: AuthConfig;
  path: PathConfig;
  email: EmailConfig;
  // storage: StorageConfig;
  ui: UIConfig;
};
