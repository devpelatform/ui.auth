import { createClient } from '@supabase/supabase-js';

export const SUPABASE_BUCKET = 'dev';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);

export function getPublicUrl(path: string) {
  const { data } = supabase.storage.from(SUPABASE_BUCKET).getPublicUrl(path);

  return `${data.publicUrl}?v=${Date.now()}`;
}

export function getStorageKeyFromPublicUrl(url: string) {
  if (typeof url !== 'string') return url;

  const cleanUrl = url.split('?')[0];

  const splitPoint = '/storage/v1/object/public/';
  const index = cleanUrl.indexOf(splitPoint);
  if (index === -1) return cleanUrl;

  const afterPublic = cleanUrl.substring(index + splitPoint.length);

  const parts = afterPublic.split('/');
  parts.shift();

  return parts.join('/');
}
