import { db } from '../client';
import { emailLogs } from '../schemas/generals';
import type { EmailLogsInsert } from '../types';

/**
 * Create a new email log
 *
 * Creates a new email log with the provided details
 * Used during email sending operations
 */
export async function createEmailLog(data: EmailLogsInsert) {
  await db.insert(emailLogs).values(data);
}
