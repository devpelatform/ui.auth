import { parse as parseCookies } from 'cookie';

import { config } from '@repo/config';

export const isProduction = process.env.NODE_ENV === 'production';
export const isDevelopment = process.env.NODE_ENV === 'development';

type Locale = keyof (typeof config)['i18n']['locales'];

export const getLocaleFromRequest = (request?: Request) => {
  const cookies = parseCookies(request?.headers.get('cookie') ?? '');
  return (cookies[config.i18n.localeCookieName] as Locale) ?? config.i18n.defaultLocale;
};
