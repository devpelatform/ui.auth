import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export const SUPABASE_BUCKET = 'dev';

export function createClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.SUPABASE_SERVICE_ROLE_KEY as string,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}

export function getPublicUrl(path: string) {
  const supabase = createClient();
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
