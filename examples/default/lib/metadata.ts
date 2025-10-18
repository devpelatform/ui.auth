import { constructMetadata } from '@pelatform/utils';
import { config } from '@repo/config';

type CreateMetadataParams = {
  title?: string;
  description?: string;
  image?: string;
};

export function createMetadata(params?: CreateMetadataParams) {
  const { title, description, image } = params ?? {};

  return constructMetadata({
    baseUrl: config.appUrl,
    title: `${title ? `${title} | ` : ''}${config.appName}`,
    description,
    image,
    manifest: '/manifest.json',
    // icons: [
    //   {
    //     rel: 'apple-touch-icon',
    //     sizes: '32x32',
    //     url: '/apple-touch-icon.png',
    //   },
    //   {
    //     rel: 'icon',
    //     type: 'image/png',
    //     sizes: '32x32',
    //     url: '/favicon-32x32.png',
    //   },
    //   {
    //     rel: 'icon',
    //     type: 'image/png',
    //     sizes: '16x16',
    //     url: '/favicon-16x16.png',
    //   },
    // ],
  });
}
