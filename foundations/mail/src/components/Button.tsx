// biome-ignore lint/correctness/noUnusedImports: disable
import React, { type ReactNode } from 'react';

import { Button as EmailButton } from '@pelatform/email/components';

export function Button({ href, children }: { href: string; children: ReactNode }) {
  return (
    <EmailButton
      href={href}
      className="inline-block rounded-lg bg-brand px-5 py-2.5 font-semibold text-decoration-none text-sm text-white"
    >
      {children}
    </EmailButton>
  );
}
