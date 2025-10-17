import { and, eq } from 'drizzle-orm';

import { db } from '../client';
import { accounts } from '../schemas/users';
import type { AccountInsert } from '../types';

/**
 * Get account by ID
 *
 * Retrieves a single OAuth account by its unique ID
 */
export async function getAccountById(id: string) {
  // Query the database for an account with the specified ID
  return await db.query.accounts.findFirst({
    // Filter by account ID
    where: eq(accounts.id, id),

    // Include related user data in the result
    with: {
      user: true,
    },
  });
}

/**
 * Get accounts by user ID
 *
 * Retrieves all OAuth accounts associated with a specific user
 */
export async function getAccountsByUserId(userId: string) {
  // Query the database for all accounts belonging to the specified user
  return await db.query.accounts.findMany({
    // Filter by user ID
    where: eq(accounts.userId, userId),

    // Order results by creation date (oldest first)
    orderBy: [accounts.createdAt],
  });
}

/**
 * Get account by provider and account ID
 *
 * Retrieves an OAuth account by its provider ID and account ID combination
 */
export async function getAccountByProvider(providerId: string, accountId: string) {
  // Query the database for an account with the specified provider and account ID
  return await db.query.accounts.findFirst({
    // Filter by both provider ID and account ID to find a unique account
    where: and(eq(accounts.providerId, providerId), eq(accounts.accountId, accountId)),

    // Include related user data in the result
    with: {
      user: true,
    },
  });
}

/**
 * Create a new account
 *
 * Creates a new OAuth account linked to a user
 */
export async function createAccount(data: AccountInsert) {
  // Insert new account with values in the same order as schema definition
  const [{ id }] = await db.insert(accounts).values(data).returning({ id: accounts.id });

  // Fetch and return the newly created account with its relations
  return await getAccountById(id);
}

/**
 * Update an existing account
 *
 * Updates OAuth tokens and expiration dates for an existing account
 */
export async function updateAccount(id: string, data: Partial<AccountInsert>) {
  // Execute the update operation in the database
  await db.update(accounts).set(data).where(eq(accounts.id, id));

  // Fetch and return the updated account with its relations
  return await getAccountById(id);
}
