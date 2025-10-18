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
      // account={{
      //   basePath: '/',
      //   viewPaths: Object.fromEntries(
      //     Object.entries(config.path.account).map(([key, value]) => [
      //       key,
      //       value.replace(/^\//, ''),
      //     ]),
      //   ),
      // }}
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
      viewPaths={Object.fromEntries(
        Object.entries(config.path.auth).map(([key, value]) => [key, value.replace(/^\//, '')]),
      )}
      localization={createAuthTranslations(t)}
      // organization={{
      //   // logo: {
      //   //   upload: async (file) => {
      //   //     const formData = new FormData()
      //   //     formData.append("avatar", file)
      //   //     const res = await fetch("/api/uploadAvatar", { method: "POST", body: formData })
      //   //     const { data } = await res.json()
      //   //     return data.url
      //   //   },
      //   //   delete: async (url) => {
      //   //     await fetch("/api/deleteAvatar", {
      //   //       method: "POST",
      //   //       headers: { "Content-Type": "application/json" },
      //   //       body: JSON.stringify({ url })
      //   //     })
      //   //   },
      //   // },
      //   logo: true,
      //   apiKey: true,
      //   basePath: '/',
      //   pathMode: 'slug',
      //   slug: slug || undefined,
      //   personalPath: config.path.account.SETTINGS.replace(/^\//, ''),
      //   viewPaths: Object.fromEntries(
      //     Object.entries(config.path.workspaces).map(([key, value]) => [
      //       key,
      //       value.replace(/^\//, ''),
      //     ]),
      //   ),
      // }}
      // basePath={config.appUrl}
      captcha={{
        provider: 'cloudflare-turnstile',
        siteKey: process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY || '',
      }}
      changeEmail
      emailVerification
      magicLink
      emailOTP
      multiSession
      oneTap
      passkey
      twoFactor={['otp', 'totp']}
      social={{
        providers: ['github', 'google'],
      }}
      persistClient={false}
      navigate={router.push}
      onSessionChange={() => {
        router.refresh();
      }}
      replace={router.replace}
      Link={Link}
    >
      {children}
    </AuthUIProvider>
  );
}
