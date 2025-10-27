import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./lib/i18n/request.ts');

const nextConfig: NextConfig = {
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
  reactStrictMode: true,
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
    ],
  },
  async redirects() {
    return [
      {
        source: '/account',
        destination: '/account/settings',
        permanent: true,
      },
      {
        source: '/organization',
        destination: '/organization/settings',
        permanent: true,
      },
    ];
  },
};

// export default nextConfig;
export default withNextIntl(nextConfig);
