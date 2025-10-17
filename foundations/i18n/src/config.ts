import { config } from '@repo/config';
import type { Locale } from './types';

export function isEnable(): boolean {
  return config.i18n.enabled as boolean;
}

export function getDefaultLocale(): Locale {
  return config.i18n.defaultLocale as Locale;
}

export function getAvailableLocales(): Locale[] {
  if (!config.i18n.enabled) {
    return [config.i18n.defaultLocale as Locale];
  }

  const availableLocales = Object.keys(config.i18n.locales) as Locale[];
  return availableLocales;
}

export function isLocaleSupported(locale: string): locale is Locale {
  if (!config.i18n.enabled) {
    return locale === config.i18n.defaultLocale;
  }

  return Object.hasOwn(config.i18n.locales, locale);
}

export function getLocaleConfig(locale: Locale) {
  return config.i18n.locales[locale] || null;
}

export function getCurrencyForLocale(locale: Locale): string {
  const localeConfig = config.i18n.locales[locale];
  return localeConfig?.currency || config.i18n.defaultCurrency;
}

export function getLocaleCookieName(): string {
  return config.i18n.localeCookieName;
}

export function normalizeLocale(locale?: string): Locale {
  if (!locale) {
    return getDefaultLocale();
  }

  // Check if the exact locale is supported
  if (isLocaleSupported(locale)) {
    return locale;
  }

  // Try to find a match by language code (e.g., 'en-US' -> 'en')
  // Use string methods directly without type guard interference
  const localeStr = String(locale);
  if (localeStr.includes('-')) {
    const languageCode = localeStr.split('-')[0];
    if (languageCode && isLocaleSupported(languageCode)) {
      return languageCode as Locale;
    }
  }

  return getDefaultLocale();
}
