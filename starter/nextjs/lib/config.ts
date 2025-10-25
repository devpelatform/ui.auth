export const config = {
  appName: process.env.NEXT_PUBLIC_APP_NAME || 'Pelatform Auth Starter',
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  i18n: {
    en: {
      code: 'en',
      name: 'English',
      direction: 'ltr',
      flag: 'united-states',
    },
    id: {
      code: 'id',
      name: 'Indonesia',
      direction: 'ltr',
      flag: 'indonesia',
    },
    ar: {
      code: 'ar',
      name: 'Saudi Arabia',
      direction: 'rtl',
      flag: 'saudi-arabia',
    },
  },
  ui: {
    enableMultiThemes: true,
    defaultTheme: 'light',
  },
};
