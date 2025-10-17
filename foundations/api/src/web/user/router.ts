import { Hono } from 'hono';
import { describeRoute } from 'hono-openapi';

import { db } from '@repo/db';
import { authMiddleware } from '../../middleware/web';

export const userRouter = new Hono()
  .use(authMiddleware)
  .get(
    '/',
    describeRoute({
      tags: ['User'],
      summary: 'Get user profile',
      description: 'Get the profile of the current user',
      responses: {
        200: {
          description: 'User profile',
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

      const row = await db.query.users.findFirst({
        where: (u, { eq }) => eq(u.id, user.id),
        columns: {
          id: true,
          name: true,
          email: true,
          emailVerified: true,
          image: true,
          createdAt: true,
          updatedAt: true,
          username: true,
          role: true,
          status: true,
        },
        with: {
          members: {
            where: (m, { eq }) => eq(m.organizationId, orgId),
            columns: { role: true },
            with: {
              organization: {
                columns: { id: true, name: true, slug: true },
              },
            },
            limit: 1,
          },
        },
      });

      if (!row) {
        return c.body(null, 401);
      }

      const membership = row.members?.[0];

      // Remove memberships from the user object
      // const { memberships, ...base } = row;

      return c.json(
        {
          // ...base,
          ...row,
          workspaceRole: membership?.role || null,
          activeWorkspace: membership?.organization || null,
        },
        { status: 200 },
      );
    },
  )
  .patch(
    '/',
    describeRoute({
      tags: ['User'],
      summary: 'Update user profile',
      description: 'Update the profile of the current user',
      responses: {
        200: {
          description: 'User profile',
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

      return c.json(
        {
          user: 'OK',
        },
        { status: 200 },
      );
    },
  );
