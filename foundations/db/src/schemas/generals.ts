import * as p from 'drizzle-orm/pg-core';

const timestamps = {
  createdAt: p.timestamp('created_at').notNull().defaultNow(),
  updatedAt: p
    .timestamp('updated_at')
    .notNull()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .defaultNow(),
};

/** =========================
 *  TABLE: CONTACTS
 *  ========================= */
export const contacts = p.pgTable(
  'contacts',
  {
    id: p.uuid('id').notNull().defaultRandom().primaryKey(),
    name: p.text('name'),
    email: p.text('email').notNull(),
    subject: p.text('subject'),
    message: p.text('message'),
    metadata: p.jsonb('metadata'),
    ...timestamps,
  },
  (table) => [
    p.index('contacts_email_idx').on(table.email),
    p.index('contacts_created_at_idx').on(table.createdAt),
  ],
);

/** =========================
 *  TABLE: EMAIL_LOGS
 *  ========================= */
export const emailLogs = p.pgTable(
  'email_logs',
  {
    id: p.uuid('id').notNull().defaultRandom().primaryKey(),
    email: p.text('email'),
    metadata: p.jsonb('metadata'),
    createdAt: p.timestamp('created_at').notNull().defaultNow(),
  },
  (table) => [
    p.index('email_logs_email_idx').on(table.email),
    p.index('email_logs_created_at_idx').on(table.createdAt),
  ],
);
