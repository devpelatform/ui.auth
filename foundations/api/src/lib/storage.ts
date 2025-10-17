import { createS3 } from '@pelatform/storage/s3';

export const storage = createS3({
  provider: 'supabase',
  region: process.env.PELATFORM_S3_REGION!,
  bucket: process.env.PELATFORM_S3_BUCKET!,
  accessKeyId: process.env.PELATFORM_S3_ACCESS_KEY_ID!,
  secretAccessKey: process.env.PELATFORM_S3_SECRET_ACCESS_KEY!,
  endpoint: process.env.PELATFORM_S3_ENDPOINT!,
});
