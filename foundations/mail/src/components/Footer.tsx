// biome-ignore lint/correctness/noUnusedImports: disable
import React from 'react';

import { Hr, Section, Tailwind, Text } from '@pelatform/email/components';
import { config } from '@repo/config';

// biome-ignore lint/suspicious/noExplicitAny: disable
export function Footer({ t }: { t: any }) {
  return (
    <Tailwind>
      <Hr className="mx-0 my-6 w-full border border-neutral-200" />
      <Section className="text-center">
        <Text className="mb-2 text-gray-500 text-sm">
          {t('email.common.footer.needHelp', { supportEmail: '' })}{' '}
          <a
            href={`mailto:${config.email.supportEmail}`}
            className="font-semibold text-brand no-underline"
          >
            {config.email.supportEmail}
          </a>
        </Text>
        <Text className="font-semibold text-gray-400 text-xs">
          {t('email.common.footer.copyright', {
            year: new Date().getFullYear(),
            companyName: config.email.companyName,
          })}
        </Text>
      </Section>
    </Tailwind>
  );
}
