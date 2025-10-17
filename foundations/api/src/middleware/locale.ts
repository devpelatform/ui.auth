import { getCookie } from 'hono/cookie';
import { createMiddleware } from 'hono/factory';

import { config } from '@repo/config';
import type { Locale } from '@repo/i18n/types';

export const localeMiddleware = createMiddleware<{
  Variables: {
    locale: Locale;
  };
}>(async (c, next) => {
  const locale =
    (getCookie(c, config.i18n.localeCookieName) as Locale) ?? config.i18n.defaultLocale;

  c.set('locale', locale);

  await next();
});
