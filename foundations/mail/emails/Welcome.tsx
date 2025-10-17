// biome-ignore lint/correctness/noUnusedImports: disable
import React from 'react';
import { createTranslator } from 'use-intl/core';

import { Section, Text } from '@pelatform/email/components';
import { config } from '@repo/config';
import { Button, Greeting, Signature, Title, Wrapper } from '../src/components';
import { defaultTranslations } from '../src/i18n';
import type { DefaultMailProps } from '../src/types';

export function Welcome({ locale, translations, name = '', url }: DefaultMailProps) {
  const t = createTranslator({
    locale,
    messages: translations,
  });

  return (
    <Wrapper t={t}>
      <Title>{t('email.welcome.title', { companyName: config.email.companyName })}</Title>

      <Section className="mb-6">
        <Greeting t={t} name={name} />

        <Text className="text-gray-600">
          {t('email.welcome.intro', { companyName: config.email.companyName })}
        </Text>

        <Text className="mb-6 text-gray-600">{t('email.welcome.nextSteps')}</Text>

        <ul className="mb-6 pl-4 text-gray-700">
          <li className="mb-2">{t('email.welcome.steps.complete')}</li>
          <li className="mb-2">{t('email.welcome.steps.explore')}</li>
          <li className="mb-2">{t('email.welcome.steps.invite')}</li>
          <li className="mb-2">{t('email.welcome.steps.docs')}</li>
        </ul>

        {url && (
          <div className="my-6 text-center">
            <Button href={url}>{t('email.welcome.button')}</Button>
          </div>
        )}

        <Text className="text-gray-600">{t('email.welcome.support')}</Text>

        <Text className="text-gray-600">{t('email.welcome.closing')}</Text>

        <Signature t={t} />
      </Section>
    </Wrapper>
  );
}

Welcome.PreviewProps = {
  locale: 'en',
  translations: defaultTranslations(),
  name: 'John Doe',
  url: 'https://app.pelatform.com/dashboard',
};

export default Welcome;
