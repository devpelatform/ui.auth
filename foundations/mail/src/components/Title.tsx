// biome-ignore lint/correctness/noUnusedImports: disable
import React, { type ReactNode } from 'react';

import { Heading, Section } from '@pelatform/email/components';

export function Title({ children }: { children: ReactNode }) {
  return (
    <Section className="mb-6">
      <Heading className="m-0 text-center font-bold text-2xl text-gray-900">{children}</Heading>
    </Section>
  );
}
