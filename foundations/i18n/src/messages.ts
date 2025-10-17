import deepmerge from 'deepmerge';

import { config } from '@repo/config';
import type { Messages } from './types';
import { TRANSLATION_ENTITIES } from './types';

const importEntityTranslation = async (
  locale: string,
  entity: string,
  // biome-ignore lint/suspicious/noExplicitAny: disable
): Promise<Record<string, any>> => {
  try {
    return (await import(`../messages/${locale}/${entity}.json`)).default;
  } catch (_error) {
    // If entity file doesn't exist for this locale, return empty object
    console.warn(`Translation file not found: ${locale}/${entity}.json`);
    return {};
  }
};

export const importLocale = async (locale: string): Promise<Messages> => {
  // biome-ignore lint/suspicious/noExplicitAny: disable
  const translations: Record<string, any> = {};

  // Import all entity translations for this locale
  for (const entity of TRANSLATION_ENTITIES) {
    const entityTranslations = await importEntityTranslation(locale, entity);
    if (Object.keys(entityTranslations).length > 0) {
      translations[entity] = entityTranslations;
    }
  }

  return translations as Messages;
};

export const getMessagesForLocale = async (locale: string): Promise<Messages> => {
  const localeMessages = await importLocale(locale);

  if (locale === config.i18n.defaultLocale) {
    return localeMessages;
  }

  // Get default locale messages as fallback
  const defaultLocaleMessages = await importLocale(config.i18n.defaultLocale);

  // Merge default locale with current locale (current locale takes precedence)
  return deepmerge(defaultLocaleMessages, localeMessages);
};
