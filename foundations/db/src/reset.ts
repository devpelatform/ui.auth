import { client } from './client';

// SQL statements sebagai template literals
const resetSQL = `
  DROP SCHEMA IF EXISTS drizzle CASCADE;
  DROP SCHEMA IF EXISTS public CASCADE;
  CREATE SCHEMA public;
`;

/**
 * Reset database schema
 * Drops existing schemas and recreates public schema
 */
async function resetDatabase() {
  try {
    // Method 1: Execute single SQL string
    await client.unsafe(resetSQL);

    console.log('Database reset completed successfully');

    // Close database connection and exit process
    await client.end();
    process.exit(0);
  } catch (error) {
    console.error('Error resetting database:', error);
    await client.end();
    process.exit(1);
  }
}

resetDatabase();
