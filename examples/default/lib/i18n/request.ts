import { getRequestConfig } from 'next-intl/server';

import { getMessagesForLocale } from '@repo/i18n';
import { getUserLocale } from './server';

export default getRequestConfig(async () => {
  const locale = await getUserLocale();

  const messages = await getMessagesForLocale(locale);

  return {
    locale,
    messages,
  };
});
