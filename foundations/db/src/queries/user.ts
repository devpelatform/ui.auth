import { eq } from 'drizzle-orm';

import { db } from '../client';
import { users } from '../schemas/users';
import type { UserInsert } from '../types';

// export async function getInitialUserData(session: Session | null) {
//   if (!session?.userId) {
//     return null;
//   }

//   const userId = session.userId;
//   const user = await db.query.user.findFirst({
//     where: (user, { eq }) => eq(user.id, userId),
//   });

//   if (!user) {
//     return { user: null, isAuthenticated: false };
//   }

//   const activeOrganizationId = session?.activeOrganizationId;
//   if (activeOrganizationId && typeof activeOrganizationId !== 'string') {
//     console.warn(
//       'Invalid activeOrganizationId type:',
//       typeof activeOrganizationId,
//     );
//     return { user: null, isAuthenticated: true };
//   }

//   const member = activeOrganizationId
//     ? await db.query.member.findFirst({
//         where: (member, { eq }) =>
//           and(
//             eq(member.organizationId, activeOrganizationId),
//             eq(member.userId, userId),
//           ),
//         with: {
//           organization: {
//             columns: {
//               id: true,
//               name: true,
//               slug: true,
//             },
//           },
//         },
//       })
//     : null;

//   const userWithRole = {
//     ...user,
//     workspaceRole: member?.role || null,
//     activeWorkspace: member?.organization || null,
//   };

//   return { user: userWithRole, isAuthenticated: true };
// }

/**
 * Get user by ID
 *
 * Retrieves a single user by its unique ID with all related data
 * Used when you need to access a specific user's details
 */
export async function getUserById(id: string) {
  // Query the database for a user with the specified ID
  return await db.query.users.findFirst({
    // Filter by user ID
    where: eq(users.id, id),
  });
}

/**
 * Get user by email
 *
 * Retrieves a single user by email with all related data
 * Used for login, password reset, and finding users by email
 */
export async function getUserByEmail(email: string) {
  // Query the database for a user with the specified email
  return await db.query.users.findFirst({
    // Filter by user email
    where: eq(users.email, email),
  });
}

/**
 * Get user by username
 *
 * Retrieves a single user by username with all related data
 * Used for login, profile pages, and finding users by username
 */
export async function getUserByUsername(username: string) {
  // Query the database for a user with the specified username
  return await db.query.users.findFirst({
    // Filter by username
    where: eq(users.username, username),
  });
}

/**
 * Get user by phone number
 *
 * Retrieves a single user by phone number with all related data
 * Used for login via phone, SMS verification, and finding users by phone
 */
export async function getUserByPhone(phone: string) {
  // Query the database for a user with the specified phone number
  return await db.query.users.findFirst({
    // Filter by phone number
    where: eq(users.phoneNumber, phone),
  });
}

/**
 * Create a new user
 *
 * Creates a new user with the provided details
 * Used during registration, invitation acceptance, or admin user creation
 */
export async function createUser(data: UserInsert) {
  // Insert new user with values in the same order as schema definition
  const [{ id }] = await db.insert(users).values(data).returning({ id: users.id });

  // Fetch and return the newly created user with all related data
  return await getUserById(id);
}

/**
 * Update an existing user
 *
 * Updates a user with the provided values
 * Used for profile updates, admin edits, and system operations
 */
export async function updateUser(id: string, data: Partial<UserInsert>) {
  // Execute the update operation to modify the user
  await db.update(users).set(data).where(eq(users.id, id));

  // Fetch and return the updated user with all related data
  return await getUserById(id);
}

export async function updateUserLastPasswordChange(id: string) {
  return await db.update(users).set({ lastPasswordChange: new Date() }).where(eq(users.id, id));
}

export async function updateUserLastSignInAt(id: string) {
  return await db.update(users).set({ lastSignInAt: new Date() }).where(eq(users.id, id));
}

export async function updateUserDefaultWorkspace(id: string, data: string) {
  return await db.update(users).set({ defaultWorkspace: data }).where(eq(users.id, id));
}

export async function getDefaultUserWorkspace(id: string) {
  return await db.query.users.findFirst({
    where: eq(users.id, id),
    columns: {
      defaultWorkspace: true,
    },
  });
}
