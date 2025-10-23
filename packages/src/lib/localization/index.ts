import {
  ACCOUNT_STRINGS,
  API_KEY_STRINGS,
  AUTH_STRINGS,
  DISPLAY_ID_STRINGS,
  EMAIL_VERIFICATION_STRINGS,
  FORM_STRINGS,
  GENERAL_STRINGS,
  LEGAL_STRINGS,
  MAGIC_LINK_STRINGS,
  MEDIA_STRINGS,
  MEMBER_STRINGS,
  ORGANIZATION_STRINGS,
  PASSKEY_STRINGS,
  PASSWORD_STRINGS,
  SESSION_STRINGS,
  SETTINGS_STRINGS,
  TWO_FACTOR_STRINGS,
  USER_ROLE_STRINGS,
} from './base';
import { ERROR_CODES_LOCALIZATION } from './errors';

export const authLocalization = {
  // Spread all categorized strings
  ...GENERAL_STRINGS,
  ...ACCOUNT_STRINGS,
  ...AUTH_STRINGS,
  ...FORM_STRINGS,
  ...PASSWORD_STRINGS,
  ...MAGIC_LINK_STRINGS,
  ...TWO_FACTOR_STRINGS,
  ...PASSKEY_STRINGS,
  ...API_KEY_STRINGS,
  ...MEDIA_STRINGS,
  ...SESSION_STRINGS,
  ...SETTINGS_STRINGS,
  ...EMAIL_VERIFICATION_STRINGS,
  ...LEGAL_STRINGS,
  ...USER_ROLE_STRINGS,
  ...ORGANIZATION_STRINGS,
  ...MEMBER_STRINGS,
  ...DISPLAY_ID_STRINGS,

  // Error codes
  ...ERROR_CODES_LOCALIZATION,
};

export type AuthLocalization = Partial<typeof authLocalization>;

type TFunction =
  // biome-ignore lint/suspicious/noExplicitAny: disable
  ((key: string, values?: Record<string, any>) => string) | null;

export function createAuthTranslations(t: TFunction): AuthLocalization {
  if (!t) {
    return {};
  }

  const translations: AuthLocalization = {};

  (Object.keys(authLocalization) as Array<keyof typeof authLocalization>).forEach((key) => {
    translations[key] = t(key as string);
  });

  return translations;
}
