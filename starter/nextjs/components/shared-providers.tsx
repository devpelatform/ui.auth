import { type ReactNode, Suspense } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';

import { QueryProvider, ThemeProvider } from '@pelatform/ui/components';
import { Toaster as Sooner } from '@pelatform/ui/default';
import { config } from '@/lib/config';

export async function RootProviders({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  const messages = await getMessages({ locale });

  return (
    <QueryProvider>
      <ThemeProvider defaultTheme={config.ui.defaultTheme}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Suspense>
            {children}
            <Sooner />
          </Suspense>
        </NextIntlClientProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}
