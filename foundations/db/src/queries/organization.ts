import { and, eq, or } from 'drizzle-orm';

import { db } from '../client';
import { firstRow } from '../helpers';
import { members, organizations } from '../schemas/organizations';
import { getDefaultUserWorkspace, updateUserDefaultWorkspace } from './user';

export async function getLastActiveOrg(userId: string, slug?: string) {
  // Check if user still has access to this organization by slug
  if (slug) {
    const orgRows = await db
      .select({
        id: organizations.id,
        slug: organizations.slug,
      })
      .from(organizations)
      .innerJoin(members, eq(members.organizationId, organizations.id))
      .where(and(eq(members.userId, userId), eq(organizations.slug, slug)))
      .limit(1);

    const org = firstRow(orgRows);
    if (org) {
      await updateUserDefaultWorkspace(userId, org.slug ?? '');
      return {
        id: org.id,
        slug: org.slug,
      };
    }
  }

  // Check if user has a default workspace
  const defaultWorkspace = await getDefaultUserWorkspace(userId);
  if (defaultWorkspace?.defaultWorkspace) {
    const orgDefaultRows = await db
      .select({
        id: organizations.id,
        slug: organizations.slug,
      })
      .from(organizations)
      .innerJoin(members, eq(members.organizationId, organizations.id))
      .where(
        and(eq(members.userId, userId), eq(organizations.slug, defaultWorkspace.defaultWorkspace!)),
      )
      .limit(1);

    const orgDefault = firstRow(orgDefaultRows);
    if (orgDefault) {
      return {
        id: orgDefault.id,
        slug: orgDefault.slug,
      };
    }
  }

  // If no last visited organization or user lost access, try to find an organization where user is owner
  const orgOwnerRows = await db
    .select({
      id: organizations.id,
      slug: organizations.slug,
    })
    .from(organizations)
    .innerJoin(members, eq(members.organizationId, organizations.id))
    .where(
      and(
        eq(members.userId, userId),
        or(eq(members.role, 'owner'), eq(organizations.ownerId, userId)),
      ),
    )
    .limit(1);

  const orgOwner = firstRow(orgOwnerRows);
  if (orgOwner) {
    await updateUserDefaultWorkspace(userId, orgOwner.slug ?? '');
    return {
      id: orgOwner.id,
      slug: orgOwner.slug,
    };
  }

  // If no owner organization, check for any organization user is a member of
  const orgMemberRows = await db
    .select({
      id: organizations.id,
      slug: organizations.slug,
    })
    .from(organizations)
    .innerJoin(members, eq(members.organizationId, organizations.id))
    .where(and(eq(members.userId, userId)))
    .limit(1);

  const orgMember = firstRow(orgMemberRows);
  if (orgMember) {
    await updateUserDefaultWorkspace(userId, orgMember.slug ?? '');
    return {
      id: orgMember.id,
      slug: orgMember.slug,
    };
  }

  return null;
}

// export async function getLastActiveWorkspace(userId: string, slug?: string) {
//   // Check if user still has access to this workspace by slug
//   if (slug) {
//     const workspaceRows = await db
//       .select({
//         id: organization.id,
//         slug: organization.slug,
//       })
//       .from(organization)
//       .innerJoin(member, eq(member.organizationId, organization.id))
//       .where(and(eq(member.userId, userId), eq(organization.slug, slug)))
//       .limit(1);

//     const workspace = firstRow(workspaceRows);
//     if (workspace) {
//       return {
//         id: workspace.id,
//         slug: workspace.slug,
//       };
//     }
//   }

//   // If no last visited workspace or user lost access, try to find a workspace where user is owner
//   const workspaceOwnerRows = await db
//     .select({
//       id: organization.id,
//       slug: organization.slug,
//     })
//     .from(organization)
//     .innerJoin(member, eq(member.organizationId, organization.id))
//     .where(
//       and(
//         eq(member.userId, userId),
//         or(eq(member.role, 'owner'), eq(organization.ownerId, userId)),
//       ),
//     )
//     .limit(1);

//   const workspaceOwner = firstRow(workspaceOwnerRows);
//   if (workspaceOwner) {
//     return {
//       id: workspaceOwner.id,
//       slug: workspaceOwner.slug,
//     };
//   }

//   // If no owner workspace, check for any workspace user is a member of
//   const workspaceMemberRows = await db
//     .select({
//       id: organization.id,
//       slug: organization.slug,
//     })
//     .from(organization)
//     .innerJoin(member, eq(member.organizationId, organization.id))
//     .where(and(eq(member.userId, userId)))
//     .limit(1);

//   const workspaceMember = firstRow(workspaceMemberRows);
//   if (workspaceMember) {
//     return {
//       id: workspaceMember.id,
//       slug: workspaceMember.slug,
//     };
//   }

//   return null;
// }

// export async function getInitialWorkspaceData(
//   session: Session | null,
// ): Promise<Workspace | null> {
//   if (!session?.userId || !session?.activeOrganizationId) {
//     return null;
//   }

//   const userId = session.userId;
//   const wsId = session.activeOrganizationId;

//   const workspace = await db.query.organization.findFirst({
//     where: (org, { eq }) => eq(org.id, wsId),
//     columns: {
//       id: true,
//       name: true,
//       slug: true,
//       logo: true,
//       createdAt: true,
//       status: true,
//       timezone: true,
//     },
//     with: {
//       members: {
//         columns: {
//           id: true,
//           organizationId: true,
//           userId: true,
//           role: true,
//           createdAt: true,
//         },
//         with: {
//           user: { columns: { id: true, name: true, email: true, image: true } },
//         },
//       },
//       invitations: {
//         columns: {
//           id: true,
//           email: true,
//           role: true,
//           status: true,
//           organizationId: true,
//           inviterId: true,
//           expiresAt: true,
//         },
//       },
//       subscription: {
//         columns: {
//           id: true,
//           status: true,
//           plan: true,
//           currentPeriodStart: true,
//           currentPeriodEnd: true,
//           cancelAtPeriodEnd: true,
//           canceledAt: true,
//         },
//       },
//     },
//   });

//   if (!workspace) {
//     return null;
//   }

//   // Find current user's role in this workspace
//   const currentUserRole =
//     workspace.members.find((m) => m.userId === userId)?.role ?? null;

//   return Object.assign(workspace, {
//     currentUserRole,
//   }) as Workspace;
// }

// export async function getWorkspaceById(id: string) {
//   const rows = await db
//     .select({ organization })
//     .from(organization)
//     .where(eq(organization.id, id))
//     .limit(1);

//   return firstRow(rows)?.organization ?? null;
// }

// export async function getWorkspaceBySlug(slug: string) {
//   const rows = await db
//     .select({ organization })
//     .from(organization)
//     .where(eq(organization.slug, slug))
//     .limit(1);

//   return firstRow(rows)?.organization ?? null;
// }

// export async function getWorkspaceSlugById(id: string) {
//   const rows = await db
//     .select({ slug: organization.slug })
//     .from(organization)
//     .where(eq(organization.id, id))
//     .limit(1);

//   return firstRow(rows)?.slug ?? null;
// }

// export async function checkUserHasWorkspaceAccessBySlug(
//   userId: string,
//   slug: string,
// ): Promise<boolean> {
//   if (!userId || !slug) return false;

//   const rows = await db
//     .select({ id: organization.id })
//     .from(organization)
//     .leftJoin(
//       member,
//       and(
//         eq(member.organizationId, organization.id),
//         eq(member.userId, userId),
//       ),
//     )
//     .where(
//       and(
//         eq(organization.slug, slug),
//         or(eq(organization.ownerId, userId), eq(member.userId, userId)),
//       ),
//     )
//     .limit(1);

//   return rows.length > 0;
// }

// export async function checkUserHasWorkspaceAccessById(
//   userId: string,
//   orgId: string,
// ): Promise<boolean> {
//   if (!userId || !orgId) return false;

//   const rows = await db
//     .select({ id: organization.id })
//     .from(organization)
//     .leftJoin(
//       member,
//       and(
//         eq(member.organizationId, organization.id),
//         eq(member.userId, userId),
//       ),
//     )
//     .where(
//       and(
//         eq(organization.id, orgId),
//         or(eq(organization.ownerId, userId), eq(member.userId, userId)),
//       ),
//     )
//     .limit(1);

//   return rows.length > 0;
// }
