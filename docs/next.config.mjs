import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  // nextjs 16
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },

  reactStrictMode: true,
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/ui.auth' : '',
  images: { unoptimized: true },
};

export default withMDX(config);
