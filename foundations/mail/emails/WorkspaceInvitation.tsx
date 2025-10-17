// biome-ignore lint/correctness/noUnusedImports: disable
import React from 'react';
import { createTranslator } from 'use-intl/core';

import { Section, Text } from '@pelatform/email/components';
import { config } from '@repo/config';
import { Button, Copy, Expires, Greeting, Signature, Title, Wrapper } from '../src/components';
import { defaultTranslations } from '../src/i18n';
import type { WorkspaceInvitationMailProps } from '../src/types';

export function WorkspaceInvitation({
  locale,
  translations,
  name = '',
  url = '#',
  expiresIn,
  workspaceName,
  inviterName,
}: WorkspaceInvitationMailProps) {
  const t = createTranslator({
    locale,
    messages: translations,
  });

  return (
    <Wrapper t={t}>
      <Title>{t('email.workspaceInvitation.title')}</Title>

      <Section className="mb-6">
        <Greeting t={t} name={name} />

        <Text className="text-gray-600">
          {inviterName
            ? t.rich('email.workspaceInvitation.introNew', {
                name: () => <strong>{inviterName}</strong>,
                wsname: () => <strong>{workspaceName}</strong>,
                compname: () => config.appName,
              })
            : t.rich('email.workspaceInvitation.intro', {
                wsname: () => <strong>{workspaceName}</strong>,
                compname: () => config.appName,
              })}
        </Text>

        <div className="my-6 text-center">
          <Button href={url}>{t('email.workspaceInvitation.button')} &rarr;</Button>
        </div>

        <Copy t={t} url={url} />

        <Expires t={t} expiresIn={expiresIn} />

        <Text className="text-gray-700">{t('email.workspaceInvitation.noRequest')}</Text>

        <Signature t={t} />
      </Section>
    </Wrapper>
  );
}

WorkspaceInvitation.PreviewProps = {
  locale: 'en',
  translations: defaultTranslations(),
  name: 'John Doe',
  url: 'https://google.com',
  expiresIn: '2 days',
  workspaceName: 'Acme Inc',
  inviterName: 'Phantom',
};

export default WorkspaceInvitation;
