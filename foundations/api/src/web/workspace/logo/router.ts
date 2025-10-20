import { Hono } from 'hono';
import { describeRoute } from 'hono-openapi';

import {
  getPublicUrl,
  getStorageKeyFromPublicUrl,
  SUPABASE_BUCKET,
  supabase,
} from '../../../lib/supabase';
import { authMiddleware } from '../../../middleware/web';

export const workspaceLogoRouter = new Hono()
  .use(authMiddleware)
  .post(
    '/',
    describeRoute({
      tags: ['Workspace'],
      summary: 'Upload workspace logo',
      description: 'Upload the logo of the current workspace',
      responses: {
        200: {
          description: 'Workspace logo uploaded',
        },
        401: {
          description: 'Unauthorized',
        },
      },
    }),
    async (c) => {
      const session = c.get('session');
      const user = c.get('user');
      const orgId = session?.activeOrganizationId;
      if (!session || !user || !orgId) {
        return c.body(null, 401);
      }

      const body = await c.req.parseBody();
      const file = body.logo as File;

      const ext = (file.name.split('.').pop() || 'png').toLowerCase();
      const path = `workspaces/logo/${orgId}.${ext}`;

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
      tags: ['Workspace'],
      summary: 'Delete workspace logo',
      description: 'Delete the logo of the current workspace',
      responses: {
        200: {
          description: 'Workspace logo deleted',
        },
        401: {
          description: 'Unauthorized',
        },
      },
    }),
    async (c) => {
      const session = c.get('session');
      const user = c.get('user');
      const orgId = session?.activeOrganizationId;
      if (!session || !user || !orgId) {
        return c.body(null, 401);
      }

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
