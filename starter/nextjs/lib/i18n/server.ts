'use server';

import { cookies } from 'next/headers';

import { isDevelopment } from '@pelatform/utils';
import type { Locale } from '../types';

export async function getUserLocale(): Promise<Locale> {
  const cookieValue = (await cookies()).get('I18N')?.value;
  return (cookieValue as Locale) || 'en';
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

  (await cookies()).set('I18N', locale, cookieOptions);
}
