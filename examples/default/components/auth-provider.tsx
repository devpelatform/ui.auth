'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { AuthUIProvider, createAuthTranslations } from '@pelatform/ui.auth';
import { authClient } from '@repo/auth/client';

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const t = useTranslations('auth');

  return (
    <AuthUIProvider
      authClient={authClient}
      // additionalFields
      avatar={{
        upload: async (file: File) => {
          const formData = new FormData();
          formData.append('avatar', file);
          const res = await fetch('/api/user/avatar', { method: 'POST', body: formData });
          const { file: uploadedFile } = await res.json();
          return uploadedFile.url;
        },
        delete: async (url: string) => {
          await fetch('/api/user/avatar', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url }),
          });
        },
      }}
      // basePath={config.appUrl}
      // baseURL
      changeEmail
      deleteUser
      emailVerification
      // freshAge
      // gravatar
      Link={Link}
      localization={createAuthTranslations(t)}
      navigate={router.push}
      // nameRequired
      onSessionChange={() => {
        router.refresh();
      }}
      persistClient={false}
      // redirectTo
      replace={router.replace}
      // signUp
      // toast
      // viewPaths={Object.fromEntries(
      //   Object.entries(config.path.auth).map(([key, value]) => [key, value.replace(/^\//, '')]),
      // )}
      // Plugins Configuration
      apiKey
      captcha={{
        provider: 'cloudflare-turnstile',
        siteKey: process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY || '',
      }}
      credentials={{
        confirmPassword: true,
        forgotPassword: true,
        // passwordValidation: {
        //   minLength: 8,
        //   maxLength: 100,
        //   regex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        // },
        rememberMe: true,
        username: true,
      }}
      emailOTP
      // genericOAuth
      magicLink
      multiSession
      oneTap
      organization
      passkey
      social={{
        providers: ['github', 'google'],
      }}
      twoFactor={['otp', 'totp']}
      // Account Configuration
      account={true}
      // account={{
      //   basePath: '/',
      //   viewPaths: Object.fromEntries(
      //     Object.entries(config.path.account).map(([key, value]) => [
      //       key,
      //       value.replace(/^\//, ''),
      //     ]),
      //   ),
      // }}
    >
      {children}
    </AuthUIProvider>
  );
}
