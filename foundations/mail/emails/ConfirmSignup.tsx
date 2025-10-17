// biome-ignore lint/correctness/noUnusedImports: disable
import React from 'react';
import { createTranslator } from 'use-intl/core';

import { Section, Text } from '@pelatform/email/components';
import { config } from '@repo/config';
import { Button, Copy, Expires, Greeting, Signature, Title, Wrapper } from '../src/components';
import { defaultTranslations } from '../src/i18n';
import type { DefaultMailProps } from '../src/types';

export function ConfirmSignup({
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
      <Title>{t('email.confirmSignup.title')}</Title>

      <Section className="mb-6">
        <Greeting t={t} name={name} />

        <Text className="text-gray-600">
          {t('email.confirmSignup.intro', {
            companyName: config.email.companyName,
          })}
        </Text>

        <div className="my-6 text-center">
          <Button href={url}>{t('email.confirmSignup.button')} &rarr;</Button>
        </div>

        <Copy t={t} url={url} />

        <Expires t={t} expiresIn={expiresIn} />

        <Signature t={t} />
      </Section>
    </Wrapper>
  );
}

ConfirmSignup.PreviewProps = {
  locale: 'en',
  translations: defaultTranslations(),
  name: 'John Doe',
  url: 'https://google.com',
  expiresIn: '1 hour',
};

export default ConfirmSignup;
