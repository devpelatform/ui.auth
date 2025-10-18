import type { ReactNode } from 'react';
import type { Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import { config } from '@repo/config';
import { getLocaleConfig } from '@repo/i18n';
import { AuthProvider } from '@/components/auth-provider';
import { Header } from '@/components/header';
import { RootProviders } from '@/components/shared-providers';
import { getUserLocale } from '@/lib/i18n/server';
import { createMetadata } from '@/lib/metadata';

import '@/styles/globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata = createMetadata({
  title: config.appName,
});

export const viewport: Viewport = {
  initialScale: 1,
  viewportFit: 'cover',
  width: 'device-width',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  // Get user's locale from cookie
  const locale = await getUserLocale();

  // Get current language info for direction support
  const currentLang = getLocaleConfig(locale);
  const direction = currentLang?.direction || 'ltr';

  return (
    <html
      lang={locale}
      dir={direction}
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="flex min-h-svh flex-col antialiased">
        <RootProviders>
          <AuthProvider>
            <Header />
            {children}
          </AuthProvider>
        </RootProviders>
      </body>
    </html>
  );
}
