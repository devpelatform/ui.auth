'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { AuthUIProvider, createAuthTranslations } from '@pelatform/ui.auth';
import { authClient } from '@/lib/auth-client';

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const t = useTranslations();

  return (
    <AuthUIProvider
      authClient={authClient}
      additionalFields={{
        company: {
          label: 'Company',
          placeholder: 'Your company name',
          description: 'Enter your company name',
          required: false,
          type: 'string',
        },
        age: {
          label: 'Age',
          placeholder: 'Your age',
          description: 'Enter your age',
          instructions: 'You must be 18 or older',
          required: false,
          type: 'number',
          validate: async (value: string) => parseInt(value) >= 18,
        },
      }}
      avatar={true}
      // basePath
      // baseURL
      changeEmail
      deleteUser
      // displayId
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
      signUp={{
        fields: ['company', 'age'],
      }}
      // toast
      // viewPaths

      // Plugins Configuration
      apiKey
      captcha={{
        provider: 'cloudflare-turnstile',
        siteKey: process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY || '',
      }}
      credentials={{
        confirmPassword: true,
        forgotPassword: true,
        rememberMe: true,
        username: true,
      }}
      emailOTP
      // genericOAuth
      lastLoginMethod
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
      account={{
        fields: ['image', 'name', 'company', 'age'],
      }}
      syncSession={true}
    >
      {children}
    </AuthUIProvider>
  );
}
