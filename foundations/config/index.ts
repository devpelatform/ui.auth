import type { Config } from './types';

function baseUrl() {
  if (process.env.NEXT_PUBLIC_NGROK_URL) {
    return process.env.NEXT_PUBLIC_NGROK_URL;
  }

  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }

  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }

  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export const config = {
  appName: process.env.NEXT_PUBLIC_APP_NAME || 'Pelatform',
  appUrl: baseUrl(),
  apiUrl: process.env.NEXT_PUBLIC_API_URL || `http://localhost:${process.env.API_PORT ?? 3001}`,
  i18n: {
    enabled: true,
    locales: {
      en: {
        code: 'en',
        name: 'English',
        shortName: 'EN',
        direction: 'ltr',
        flag: 'united-states',
        currency: 'USD',
      },
      id: {
        code: 'id',
        name: 'Indonesia',
        shortName: 'ID',
        direction: 'ltr',
        flag: 'indonesia',
        currency: 'IDR',
      },
      ar: {
        code: 'ar',
        name: 'Saudi Arabia',
        shortName: 'AR',
        direction: 'rtl',
        flag: 'saudi-arabia',
        currency: 'USD',
      },
    },
    defaultLocale: 'en',
    defaultCurrency: 'USD',
    localeCookieName: 'I18N_LOCALE',
  },
  auth: {
    signup: true,
    password: true,
    magicLink: true,
    passkey: true,
    twoFactor: true,
    google: true,
    github: true,
    redirectAfterSignIn: '/',
    redirectAfterLogout: '/signin',
    sessionCookieMaxAge: 60 * 60 * 24 * 30,
  },
  path: {
    auth: {
      CALLBACK: '/callback',
      EMAIL_OTP: '/otp',
      FORGOT_PASSWORD: '/forgot-password',
      MAGIC_LINK: '/magic',
      RECOVER_ACCOUNT: '/recovery',
      RESET_PASSWORD: '/reset-password',
      SIGN_IN: '/signin',
      SIGN_OUT: '/signout',
      SIGN_UP: '/signup',
      TWO_FACTOR: '/2fa',
    },
    account: {
      SETTINGS: '/account/settings',
      SECURITY: '/account/settings/security',
      API_KEYS: '/account/settings/apikeys',
    },
    main: {
      ERROR: '/error',
      HOME: '/home',
      PRICING: '/pricing',
    },
    workspaces: {
      ACCEPT_INVITATION: '/join',
      SETTINGS: '/settings',
      MEMBERS: '/settings/people',
      API_KEYS: '/settings/apikeys',
    },
  },
  email: {
    provider: 'resend',
    brandColor: '#24b47e',
    companyName: 'Pelatform',
    logoUrl: 'https://assets.pelatform.com/logo/logo.png',
    supportEmail: 'support@pelatform.com',
    websiteUrl: 'https://pelatform.com',
    databaseLog: true,
  },
  // storage: {
  //   bucket: 'main',
  // },
  ui: {
    enableMultiThemes: true,
    defaultTheme: 'light',
    // saas: true,
    // marketing: true,
  },
} as const satisfies Config;
