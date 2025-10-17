import { render } from '@react-email/render';

import { getMessagesForLocale } from '@repo/i18n';
import type { Locale, Messages } from '@repo/i18n/types';
import { mailTemplates } from '../emails';

export async function getTemplate<T extends TemplateId>({
  templateId,
  context,
  locale,
}: {
  templateId: T;
  context: Omit<Parameters<(typeof mailTemplates)[T]>[0], 'locale' | 'translations'>;
  locale: Locale;
}) {
  const template = mailTemplates[templateId];
  const translations = await getMessagesForLocale(locale);

  const email = template({
    // biome-ignore lint/suspicious/noExplicitAny: disable
    ...(context as any),
    locale,
    translations,
  });

  // Get subject based on template ID and email structure
  let subject = '';
  try {
    const emailSection = translations.email[templateId as keyof Messages['email']];
    if (emailSection && typeof emailSection === 'object' && 'subject' in emailSection) {
      subject = emailSection.subject as string;
    }
  } catch (error) {
    console.warn(`Could not get subject for template ${templateId}:`, error);
  }

  const html = await render(email);
  const text = await render(email, { plainText: true });
  return { html, text, subject };
}

/**
 * Type representing all available email template IDs
 *
 * @description This type is automatically generated from the mailTemplates object
 * and ensures type safety when referencing template IDs.
 *
 * @example
 * const templateId: TemplateId = 'welcome'; // ✅ Valid
 * const invalid: TemplateId = 'invalid';    // ❌ TypeScript error
 */
export type TemplateId = keyof typeof mailTemplates;
