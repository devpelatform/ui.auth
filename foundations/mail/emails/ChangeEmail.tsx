// biome-ignore lint/correctness/noUnusedImports: disable
import React from 'react';
import { createTranslator } from 'use-intl/core';

import { Section, Text } from '@pelatform/email/components';
import { Button, Copy, Expires, Greeting, Signature, Title, Wrapper } from '../src/components';
import { defaultTranslations } from '../src/i18n';
import type { ChangeEmailMailProps } from '../src/types';

export function ChangeEmail({
  locale,
  translations,
  name = '',
  url = '#',
  expiresIn,
  email,
  newEmail,
}: ChangeEmailMailProps) {
  const t = createTranslator({
    locale,
    messages: translations,
  });

  return (
    <Wrapper t={t}>
      <Title>{t('email.changeEmail.title')}</Title>

      <Section className="mb-6">
        <Greeting t={t} name={name} />

        <Text className="text-gray-600">
          {t.rich('email.changeEmail.intro', {
            data: () => <strong>{email}</strong>,
            newdata: () => <strong>{newEmail}</strong>,
          })}
        </Text>

        <div className="my-6 text-center">
          <Button href={url}>{t('email.changeEmail.button')} &rarr;</Button>
        </div>

        <Copy t={t} url={url} />

        <Expires t={t} expiresIn={expiresIn} />

        <Text className="text-gray-700">{t('email.changeEmail.noRequest')}</Text>

        <Signature t={t} />
      </Section>
    </Wrapper>
  );
}

ChangeEmail.PreviewProps = {
  locale: 'en',
  translations: defaultTranslations(),
  name: 'John Doe',
  url: 'https://google.com',
  expiresIn: '1 hour',
  email: 'admin@gmail.com',
  newEmail: 'new@gmail.com',
};

export default ChangeEmail;
