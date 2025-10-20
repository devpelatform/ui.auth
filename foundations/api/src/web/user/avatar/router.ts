import { Hono } from 'hono';
import { describeRoute } from 'hono-openapi';

import {
  createClient,
  getPublicUrl,
  getStorageKeyFromPublicUrl,
  SUPABASE_BUCKET,
} from '../../../lib/supabase';
import { authMiddleware } from '../../../middleware/web';

export const userAvatarRouter = new Hono()
  .use(authMiddleware)
  .post(
    '/',
    describeRoute({
      tags: ['User'],
      summary: 'Upload user avatar',
      description: 'Upload the avatar of the current user',
      responses: {
        200: {
          description: 'User avatar uploaded',
        },
        401: {
          description: 'Unauthorized',
        },
      },
    }),
    async (c) => {
      const session = c.get('session');
      const user = c.get('user');
      if (!session || !user) {
        return c.body(null, 401);
      }

      const supabase = createClient();

      const body = await c.req.parseBody();
      const file = body.avatar as File;

      const ext = (file.name.split('.').pop() || 'png').toLowerCase();
      const path = `users/avatars/${user.id}.${ext}`;

      const { data: uploadData, error: upErr } = await supabase.storage
        .from(SUPABASE_BUCKET)
        .upload(path, file, { upsert: true, contentType: file.type });

      if (upErr) {
        return c.json({ error: upErr.message }, 500);
      }

      return c.json({
        success: true,
        file: {
          path: uploadData.path,
          fullPath: uploadData.fullPath,
          url: getPublicUrl(uploadData.path),
        },
      });
    },
  )
  .delete(
    '/',
    describeRoute({
      tags: ['User'],
      summary: 'Delete user avatar',
      description: 'Delete the avatar of the current user',
      responses: {
        200: {
          description: 'User avatar deleted',
        },
        401: {
          description: 'Unauthorized',
        },
      },
    }),
    async (c) => {
      const session = c.get('session');
      const user = c.get('user');
      if (!session || !user) {
        return c.body(null, 401);
      }

      const supabase = createClient();

      const body = await c.req.json();
      const publicUrl = body.url as string;

      const key = getStorageKeyFromPublicUrl(publicUrl);

      const { error } = await supabase.storage.from(SUPABASE_BUCKET).remove([key]);

      if (!error) {
        return c.json(
          {
            success: true,
          },
          200,
        );
      } else {
        return c.json({ error: error.message }, 500);
      }
    },
  );
