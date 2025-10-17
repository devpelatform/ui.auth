// biome-ignore lint/correctness/noUnusedImports: disable
import React from 'react';

import { Text } from '@pelatform/email/components';
import { config } from '@repo/config';

// biome-ignore lint/suspicious/noExplicitAny: disable
export function Signature({ t }: { t: any }) {
  return (
    <Text className="mt-6 text-gray-700">
      {t('email.common.greetings.regards')},
      <br />
      <span className="font-semibold">
        {t('email.common.footer.signature', {
          companyName: config.email.companyName,
        })}
      </span>
    </Text>
  );
}
