// biome-ignore lint/correctness/noUnusedImports: disable
import React, { type ReactNode } from 'react';

import { Body, Container, Html, Img, Section, Tailwind } from '@pelatform/email/components';
import { config } from '@repo/config';
import { Footer } from './Footer';

// biome-ignore lint/suspicious/noExplicitAny: disable
export function Wrapper({ t, children }: { t: any; children: ReactNode }) {
  return (
    <Html lang="en">
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                brand: config.email.brandColor,
              },
            },
          },
        }}
      >
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-10 max-w-[600px] rounded border border-neutral-200 border-solid px-10 py-5">
            {config.email.logoUrl && (
              <Section className="mb-6 text-center">
                <Img
                  src={config.email.logoUrl}
                  alt={`${config.email.companyName ?? 'Brand'} Logo`}
                  height="50"
                  className="mx-auto"
                />
              </Section>
            )}
            {children}
            <Footer t={t} />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
