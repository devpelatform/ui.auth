import { Hono } from 'hono';
import { describeRoute } from 'hono-openapi';

import { generateFileKey, validateFileSize, validateFileType } from '@pelatform/storage/helpers';
import { storage } from '../../../lib/storage';
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

      const body = await c.req.parseBody();
      // const file = body.file as File;
      const file = body.avatar as File;

      // Validate file
      const sizeValidation = validateFileSize(file.size, 1 * 1024 * 1024); // 1MB
      if (!sizeValidation.valid) {
        return c.json({ error: sizeValidation.error }, 400);
      }

      const typeValidation = validateFileType(file.name, ['.png', '.jpg']);
      if (!typeValidation.valid) {
        return c.json({ error: typeValidation.error }, 400);
      }

      // Convert File to Buffer
      const buffer = Buffer.from(await file.arrayBuffer());
      const key = generateFileKey(file.name, 'users/avatar');

      // Upload to storage
      const result = await storage.upload({
        key,
        file: buffer,
        contentType: file.type,
        metadata: {
          originalName: file.name,
          uploadedAt: new Date().toISOString(),
        },
      });

      if (result.success) {
        return c.json({
          success: true,
          file: {
            key: result.key,
            url: result.url,
            size: result.size,
          },
        });
      } else {
        return c.json({ error: result.error }, 500);
      }
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

      const body = await c.req.parseBody();
      const url = body.url as string;

      const result = await storage.deleteFile(url);

      if (result.success) {
        return c.json(
          {
            success: true,
          },
          200,
        );
      } else {
        return c.json({ error: result.error }, 500);
      }
    },
  );
