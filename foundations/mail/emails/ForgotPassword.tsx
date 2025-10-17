// biome-ignore lint/correctness/noUnusedImports: disable
import React from 'react';
import { createTranslator } from 'use-intl/core';

import { Section, Text } from '@pelatform/email/components';
import { Button, Copy, Expires, Greeting, Signature, Title, Wrapper } from '../src/components';
import { defaultTranslations } from '../src/i18n';
import type { DefaultMailProps } from '../src/types';

export function ForgotPassword({
  locale,
  translations,
  name = '',
  url = '#',
  expiresIn,
}: DefaultMailProps) {
  const t = createTranslator({
    locale,
    messages: translations,
  });

  return (
    <Wrapper t={t}>
      <Title>{t('email.forgotPassword.title')}</Title>

      <Section className="mb-6">
        <Greeting t={t} name={name} />

        <Text className="text-gray-600">{t('email.forgotPassword.intro')}</Text>

        <div className="my-6 text-center">
          <Button href={url}>{t('email.forgotPassword.button')} &rarr;</Button>
        </div>

        <Copy t={t} url={url} />

        <Expires t={t} expiresIn={expiresIn} />

        <Text className="text-gray-700">{t('email.forgotPassword.noRequest')}</Text>

        <Signature t={t} />
      </Section>
    </Wrapper>
  );
}

ForgotPassword.PreviewProps = {
  locale: 'en',
  translations: defaultTranslations(),
  name: 'John Doe',
  url: 'https://google.com',
  expiresIn: '1 hour',
};

export default ForgotPassword;
