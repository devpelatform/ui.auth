// biome-ignore lint/correctness/noUnusedImports: disable
import React from 'react';
import { createTranslator } from 'use-intl/core';

import { Section, Text } from '@pelatform/email/components';
import { config } from '@repo/config';
import { Greeting, Signature, Title, Wrapper } from '../src/components';
import { defaultTranslations } from '../src/i18n';
import type { DefaultMailProps } from '../src/types';

export function NewsletterSignup({ locale, translations, name = '' }: DefaultMailProps) {
  const t = createTranslator({
    locale,
    messages: translations,
  });

  return (
    <Wrapper t={t}>
      <Title>{t('email.newsletterSignup.title')}</Title>

      <Section className="mb-6">
        <Greeting t={t} name={name} />

        <Text className="text-gray-600">
          {t('email.newsletterSignup.intro', {
            companyName: config.email.companyName,
          })}
        </Text>

        <Signature t={t} />
      </Section>
    </Wrapper>
  );
}

NewsletterSignup.PreviewProps = {
  locale: 'en',
  translations: defaultTranslations(),
  name: 'John Doe',
};

export default NewsletterSignup;
