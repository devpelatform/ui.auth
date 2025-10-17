// biome-ignore lint/correctness/noUnusedImports: disable
import React from 'react';

import { Text } from '@pelatform/email/components';

// biome-ignore lint/suspicious/noExplicitAny: disable
export function Expires({ t, expiresIn }: { t: any; expiresIn: string | undefined }) {
  if (!expiresIn) {
    return;
  }

  return (
    <Text className="text-neutral-600">
      {t.rich('email.common.expiry', {
        data: () => <strong>{expiresIn}</strong>,
      })}
    </Text>
  );
}
