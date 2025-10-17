// biome-ignore lint/correctness/noUnusedImports: disable
import React, { type ReactNode } from 'react';

import { Section } from '@pelatform/email/components';

export function Code({ children }: { children: ReactNode }) {
  return (
    <Section className="rounded-lg border border-neutral-200 border-solid">
      <div className="mx-auto w-fit px-6 py-3 text-center font-mono font-semibold text-2xl tracking-[0.25em]">
        {children}
      </div>
    </Section>
  );
}
