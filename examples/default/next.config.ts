import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./lib/i18n/request.ts');

const nextConfig: NextConfig = {
  transpilePackages: ['@repo/api'],
  // allowedDevOrigins: [ENV_APP_DOMAIN, `*.${ENV_APP_DOMAIN}`],
  reactStrictMode: true,
  serverExternalPackages: ['@aws-sdk/client-s3', '@aws-sdk/s3-request-presigner', 'prettier'],
  eslint: {
    // Replaced by root workspace command
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        // for Pelatform static assets
        protocol: 'https',
        hostname: 'assets.pelatform.com',
      },
      {
        // google profile images
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        // github profile images
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        // vercel avatar images
        protocol: 'https',
        hostname: 'avatar.vercel.sh',
      },
    ],
  },
  // async redirects() {
  //   return [
  //     {
  //       source: '/account',
  //       destination: '/account/settings',
  //       permanent: true,
  //     },
  //     {
  //       source: '/admin',
  //       destination: '/admin/overview',
  //       permanent: true,
  //     },
  //     {
  //       source: '/onboarding',
  //       destination: '/onboarding/welcome',
  //       permanent: true,
  //     },
  //   ];
  // },
};

// export default nextConfig;
export default withNextIntl(nextConfig);
