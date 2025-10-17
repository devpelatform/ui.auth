import * as p from 'drizzle-orm/pg-core';

import {
  organizationStatusEnum,
  projectStatusEnum,
  subscriptionStatusEnum,
  tokenStatusEnum,
} from './enums';
import { users } from './users';

const timestamps = {
  createdAt: p.timestamp('created_at').notNull().defaultNow(),
  updatedAt: p
    .timestamp('updated_at')
    .notNull()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .defaultNow(),
};

/** =========================
 *  TABLE: ORGANIZATIONS
 *  ========================= */
export const organizations = p.pgTable(
  'organizations',
  {
    id: p.uuid('id').notNull().defaultRandom().primaryKey(),
    name: p.text('name').notNull(),
    slug: p.text('slug').unique(),
    logo: p.text('logo'),
    metadata: p.text('metadata'),
    ...timestamps,
    // custom field
    ownerId: p.uuid('owner_id').references(() => users.id),
    customerId: p.text('customer_id'),
    status: organizationStatusEnum('status').notNull().default('ACTIVE'),
    description: p.text('description'),
    domain: p.text('domain').unique(),
    subdomain: p.text('subdomain').unique(),
    timezone: p.text('timezone').default('Asia/Jakarta'),
    referredBy: p.text('referred_by'),
    isTrashed: p.boolean('is_trashed').default(false),
    isProtected: p.boolean('is_protected').default(false),
    deletedAt: p.timestamp('deleted_at'),
  },
  (table) => [
    p.index('organizations_name_idx').on(table.name),
    p.index('organizations_slug_idx').on(table.slug),
    p.index('organizations_created_at_idx').on(table.createdAt),
    p.index('organizations_owner_id_idx').on(table.ownerId),
    p.index('organizations_customer_id_idx').on(table.customerId),
    p.index('organizations_status_idx').on(table.status),
    p.index('organizations_is_trashed_idx').on(table.isTrashed),
  ],
);

/** =========================
 *  TABLE: MEMBERS
 *  ========================= */
export const members = p.pgTable(
  'members',
  {
    id: p.uuid('id').notNull().defaultRandom().primaryKey(),
    organizationId: p
      .uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    userId: p
      .uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    role: p.text('role').notNull().default('member'),
    ...timestamps,
  },
  (table) => [
    p.uniqueIndex('member_users_org_idx').on(table.userId, table.organizationId),
    p.index('members_org_idx').on(table.organizationId),
    p.index('members_user_idx').on(table.userId),
  ],
);

/** =========================
 *  TABLE: INVITATIONS
 *  ========================= */
export const invitations = p.pgTable(
  'invitations',
  {
    id: p.uuid('id').notNull().defaultRandom().primaryKey(),
    organizationId: p
      .uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    inviterId: p
      .uuid('inviter_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    email: p.text('email').notNull(),
    role: p.text('role').notNull().default('member'),
    status: p.text('status').notNull().default('pending'),
    expiresAt: p.timestamp('expires_at').notNull(),
  },
  (table) => [
    p.index('invitations_org_idx').on(table.organizationId),
    p.index('invitations_inviter_idx').on(table.inviterId),
    p.index('invitations_email_idx').on(table.email),
    p.index('invitations_status_idx').on(table.status),
    p.index('invitations_expires_idx').on(table.expiresAt),
  ],
);

/** =========================
 *  TABLE: PROJECTS
 *  ========================= */
export const projects = p.pgTable(
  'projects',
  {
    id: p.uuid('id').notNull().defaultRandom().primaryKey(),
    organizationId: p
      .uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    createdBy: p
      .uuid('created_by')
      .notNull()
      .references(() => users.id),
    name: p.text('name').notNull(),
    status: projectStatusEnum('status').notNull().default('ACTIVE'),
    metadata: p.jsonb('metadata'),
    isTrashed: p.boolean('is_trashed').default(false),
    isProtected: p.boolean('is_protected').default(false),
    deletedAt: p.timestamp('deleted_at'),
    ...timestamps,
  },
  (table) => [
    p.index('projects_organization_id_idx').on(table.organizationId),
    p.index('projects_created_by_idx').on(table.createdBy),
    p.index('projects_name_idx').on(table.name),
    p.index('projects_status_idx').on(table.status),
    p.index('projects_is_trashed_idx').on(table.isTrashed),
    p.index('projects_created_at_idx').on(table.createdAt),
  ],
);

/** =========================
 *  TABLE: SUBSCRIPTIONS
 *  ========================= */
export const subscriptions = p.pgTable(
  'subscriptions',
  {
    id: p.uuid('id').notNull().defaultRandom().primaryKey(),
    userId: p.uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
    organizationId: p.uuid('organization_id').references(() => organizations.id, {
      onDelete: 'cascade',
    }),
    polarId: p.text('polar_id').notNull().unique(),
    plan: p.text('plan').notNull(),
    status: subscriptionStatusEnum('status').notNull().default('ACTIVE'),
    currentPeriodStart: p.timestamp('current_period_start').notNull(),
    currentPeriodEnd: p.timestamp('current_period_end').notNull(),
    canceledAt: p.timestamp('canceled_at'),
    endsAt: p.timestamp('ends_at'),
    cancelAtPeriodEnd: p.boolean('cancel_at_period_end').default(false),
    isLifetime: p.boolean('is_lifetime').default(false),
    metadata: p.jsonb('metadata'),
    ...timestamps,
  },
  (table) => [
    p.index('subscriptions_user_id_idx').on(table.userId),
    p.index('subscriptions_organization_id_idx').on(table.organizationId),
    p.index('subscriptions_polar_id_idx').on(table.polarId),
    p.index('subscriptions_status_idx').on(table.status),
    p.index('subscriptions_current_period_end_idx').on(table.currentPeriodEnd),
    p.index('subscriptions_created_at_idx').on(table.createdAt),
  ],
);

/** =========================
 *  TABLE: TOKENS
 *  ========================= */
export const tokens = p.pgTable(
  'tokens',
  {
    id: p.uuid('id').notNull().defaultRandom().primaryKey(),
    organizationId: p
      .uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    createdBy: p
      .uuid('created_by')
      .notNull()
      .references(() => users.id),
    name: p.text('name').notNull(),
    description: p.text('description'),
    status: tokenStatusEnum('status').notNull().default('ACTIVE'),
    token: p.text('token').notNull(),
    prefix: p.text('prefix'),
    permissions: p.jsonb('permissions'),
    rateLimit: p.integer('rate_limit').default(60),
    usageCount: p.integer('usage_count').default(0),
    allowedIps: p.jsonb('allowed_ips'),
    isReadOnly: p.boolean('is_read_only').default(false),
    lastUsedAt: p.timestamp('last_used_at'),
    expiresAt: p.timestamp('expires_at'),
    ...timestamps,
  },
  (table) => [
    p.index('tokens_organization_id_idx').on(table.organizationId),
    p.index('tokens_created_by_idx').on(table.createdBy),
    p.index('tokens_status_idx').on(table.status),
    p.index('tokens_prefix_idx').on(table.prefix),
    p.index('tokens_last_used_at_idx').on(table.lastUsedAt),
    p.index('tokens_expires_at_idx').on(table.expiresAt),
  ],
);

/** =========================
 *  TABLE: WEBHOOKS
 *  ========================= */
export const webhooks = p.pgTable(
  'webhooks',
  {
    id: p.uuid('id').notNull().defaultRandom().primaryKey(),
    organizationId: p
      .uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    createdBy: p
      .uuid('created_by')
      .notNull()
      .references(() => users.id),
    name: p.text('name').notNull(),
    description: p.text('description'),
    endpoint: p.text('endpoint').notNull(),
    secret: p.text('secret').notNull(),
    format: p.text('format').notNull(),
    events: p.jsonb('events'),
    enabled: p.boolean('enabled').notNull().default(true),
    metadata: p.jsonb('metadata'),
    ...timestamps,
  },
  (table) => [
    p.index('webhooks_organization_id_idx').on(table.organizationId),
    p.index('webhooks_created_by_idx').on(table.createdBy),
    p.index('webhooks_organization_enabled_idx').on(table.organizationId, table.enabled),
  ],
);
