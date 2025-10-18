'use server';

import { cookies } from 'next/headers';

import { isDevelopment } from '@pelatform/utils';
import { getDefaultLocale, getLocaleCookieName } from '@repo/i18n';
import type { Locale } from '@repo/i18n/types';

export async function getUserLocale(): Promise<Locale> {
  const cookieValue = (await cookies()).get(getLocaleCookieName())?.value;
  return (cookieValue as Locale) || getDefaultLocale();
}

export async function setUserLocale(locale: Locale): Promise<void> {
  // biome-ignore lint/suspicious/noExplicitAny: disable
  const cookieOptions: any = {
    httpOnly: false, // Allow client-side access for theme switching
    secure: !isDevelopment, // HTTPS only in production
    sameSite: 'lax', // CSRF protection
    maxAge: 60 * 60 * 24 * 365, // 1 year
    path: '/', // Available site-wide
  };

  // // Only set domain in production or if ENV_APP_DOMAIN is properly configured
  // if (ENV_APP_DOMAIN && ENV_APP_DOMAIN !== 'localhost') {
  //   cookieOptions.domain = `.${ENV_APP_DOMAIN}`;
  // }

  (await cookies()).set(getLocaleCookieName(), locale, cookieOptions);
}
