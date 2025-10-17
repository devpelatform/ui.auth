// biome-ignore lint/correctness/noUnusedImports: disable
import React from 'react';

import { Text } from '@pelatform/email/components';

// biome-ignore lint/suspicious/noExplicitAny: disable
export function Copy({ t, url }: { t: any; url: string }) {
  return (
    <Text className="text-gray-800 text-sm">
      {t('email.common.copy')}
      <span className="block font-medium text-brand leading-6 no-underline">{url}</span>
    </Text>
  );
}
