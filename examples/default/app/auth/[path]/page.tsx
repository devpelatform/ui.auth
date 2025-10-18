import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import { AuthView } from '@pelatform/ui.auth';
import { config } from '@repo/config';
import { createMetadata } from '@/lib/metadata';

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.entries(config.path.auth).map(([_key, value]) => ({
    path: value.replace(/^\//, ''),
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ path: string }> }) {
  const { path } = await params;
  const t = await getTranslations();

  const authKey = Object.entries(config.path.auth).find(
    ([_key, value]) => value.replace(/^\//, '') === path,
  )?.[0];

  return createMetadata({
    title: `${t(`auth.title.${authKey}`)}`,
  });
}

export default async function AuthPage({ params }: { params: Promise<{ path: string }> }) {
  const { path } = await params;

  return (
    <main className="container flex grow flex-col items-center justify-center gap-4 self-center p-4 md:p-6">
      <AuthView path={path} socialLayout="grid" />

      {!['callback', 'sign-out'].includes(path) && (
        <p className="w-3xs text-center text-muted-foreground text-xs">
          By continuing, you agree to our{' '}
          <Link className="text-warning underline" href="/terms" target="_blank">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link className="text-warning underline" href="/privacy" target="_blank">
            Privacy Policy
          </Link>
          .
        </p>
      )}
    </main>
  );
}
