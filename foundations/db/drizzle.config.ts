import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './migrations',
  dialect: 'postgresql',
  schema: './src/schemas',
  dbCredentials: {
    url: process.env.DATABASE_URL as string,
  },
});
