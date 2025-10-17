// biome-ignore lint/correctness/noUnusedImports: disable
import React from 'react';

import { Text } from '@pelatform/email/components';

// biome-ignore lint/suspicious/noExplicitAny: disable
export function Greeting({ t, name }: { t: any; name: string }) {
  return (
    <Text className="mb-4 font-semibold text-gray-700 text-lg">
      {t('email.common.greetings.hi', { name })}
    </Text>
  );
}
