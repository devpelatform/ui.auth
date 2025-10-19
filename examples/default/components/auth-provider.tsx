'use client';

import type { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { AuthUIProvider, createAuthTranslations } from '@pelatform/ui.auth';
import { authClient } from '@repo/auth/client';
import { config } from '@repo/config';

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const t = useTranslations('auth');

  // let { slug } = useParams() as { slug: string | null };
  // const searchParams = useSearchParams();
  // if (!slug) {
  //   slug = searchParams.get('slug') || searchParams.get('workspace');
  // }

  return (
    <AuthUIProvider
      authClient={authClient}
      // additionalFields
      avatar={{
        // upload: async (file) => {
        //   const formData = new FormData()
        //   formData.append("avatar", file)
        //   const res = await fetch("/api/uploadAvatar", { method: "POST", body: formData })
        //   const { data } = await res.json()
        //   return data.url
        // },
        // delete: async (url) => {
        //   await fetch("/api/deleteAvatar", {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify({ url })
        //   })
        // },
        Image: Image,
      }}
      // basePath={config.appUrl}
      // baseURL
      changeEmail
      // deleteUser
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
      viewPaths={Object.fromEntries(
        Object.entries(config.path.auth).map(([key, value]) => [key, value.replace(/^\//, '')]),
      )}
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
