// biome-ignore lint/correctness/noUnusedImports: disable
import React from 'react';
import { createTranslator } from 'use-intl/core';

import { Section, Text } from '@pelatform/email/components';
import { Code, Expires, Greeting, Signature, Title, Wrapper } from '../src/components';
import { defaultTranslations } from '../src/i18n';
import type { OtpMailProps } from '../src/types';

export function EmailOtp({ locale, translations, name = '', code, expiresIn }: OtpMailProps) {
  const t = createTranslator({
    locale,
    messages: translations,
  });

  return (
    <Wrapper t={t}>
      <Title>{t('email.emailOtp.title')}</Title>

      <Section className="mb-6">
        <Greeting t={t} name={name} />

        <Text className="text-gray-600">{t('email.emailOtp.intro')}</Text>

        <Code>{code}</Code>

        <Expires t={t} expiresIn={expiresIn} />

        <Text className="text-gray-700">{t('email.emailOtp.noRequest')}</Text>

        <Signature t={t} />
      </Section>
    </Wrapper>
  );
}

EmailOtp.PreviewProps = {
  locale: 'en',
  translations: defaultTranslations(),
  name: 'John Doe',
  code: '123456',
  expiresIn: '1 hour',
};

export default EmailOtp;
