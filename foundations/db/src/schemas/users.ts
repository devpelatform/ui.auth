import { sql } from 'drizzle-orm';
import * as p from 'drizzle-orm/pg-core';

import { userStatusEnum } from './enums';

const timestamps = {
  createdAt: p.timestamp('created_at').notNull().defaultNow(),
  updatedAt: p
    .timestamp('updated_at')
    .notNull()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .defaultNow(),
};

/** =========================
 *  TABLE: USERS
 *  ========================= */
export const users = p.pgTable(
  'users',
  {
    id: p.uuid('id').notNull().defaultRandom().primaryKey(),
    name: p.text('name').notNull(),
    email: p.text('email').notNull().unique(),
    emailVerified: p.boolean('email_verified').notNull().default(false),
    image: p.text('image'),
    ...timestamps,

    // Username plugin fields
    username: p.text('username').unique(),
    displayUsername: p.text('display_username'),

    // Admin plugin fields
    role: p.text('role'),
    banned: p.boolean('banned').default(false),
    banReason: p.text('ban_reason'),
    banExpires: p.timestamp('ban_expires'),

    // phone plugin fields
    phoneNumber: p.text('phone_number').unique(),
    phoneNumberVerified: p.boolean('phone_number_verified'),

    // Plugin anonymous, last login method, two-factor fields
    isAnonymous: p.boolean('is_anonymous'),
    lastLoginMethod: p.text('last_login_method'),
    twoFactorEnabled: p.boolean('two_factor_enabled').default(false),

    // Custom fields
    status: userStatusEnum('status').notNull().default('ACTIVE'),
    lastPasswordChange: p.timestamp('last_password_change'),
    lastSignInAt: p.timestamp('last_sign_in_at'),
    defaultWorkspace: p.text('default_workspace'),
    metadata: p.jsonb('metadata'),
    isTrashed: p.boolean('is_trashed').default(false),
    isProtected: p.boolean('is_protected').default(false),
    deletedAt: p.timestamp('deleted_at'),
  },
  (table) => [
    p.index('users_email_idx').on(table.email),
    p.index('users_created_at_idx').on(table.createdAt),
    p.index('users_role_idx').on(table.role),
    p.index('users_status_idx').on(table.status),
    p.index('users_default_workspace_idx').on(table.defaultWorkspace),
    p.index('users_status_trashed_idx').on(table.status, table.isTrashed),
  ],
);

/** =========================
 *  TABLE: SESSIONS
 *  ========================= */
export const sessions = p.pgTable(
  'sessions',
  {
    id: p.uuid('id').notNull().defaultRandom().primaryKey(),
    userId: p
      .uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    token: p.text('token').notNull().unique(),
    ipAddress: p.inet('ip_address'),
    userAgent: p.text('user_agent'),
    expiresAt: p.timestamp('expires_at').notNull(),
    ...timestamps,

    // Admin plugin: impersonation tracking
    impersonatedBy: p.text('impersonated_by'),

    // Organization plugin: active organization IDs
    activeOrganizationId: p.text('active_organization_id'),
  },
  (table) => [
    p.index('sessions_user_id_idx').on(table.userId),
    p.index('sessions_active_organization_id_idx').on(table.activeOrganizationId),
    p.index('sessions_ip_created_at_idx').on(table.ipAddress, table.createdAt),
    p.check('sessions_expires_after_created', sql`${table.expiresAt} > ${table.createdAt}`),
  ],
);

/** =========================
 *  TABLE: ACCOUNTS
 *  ========================= */
export const accounts = p.pgTable(
  'accounts',
  {
    id: p.uuid('id').notNull().defaultRandom().primaryKey(),
    userId: p
      .uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    accountId: p.text('account_id').notNull(),
    providerId: p.text('provider_id').notNull(),
    accessToken: p.text('access_token'),
    refreshToken: p.text('refresh_token'),
    idToken: p.text('id_token'),
    scope: p.text('scope'),
    password: p.text('password'),
    accessTokenExpiresAt: p.timestamp('access_token_expires_at'),
    refreshTokenExpiresAt: p.timestamp('refresh_token_expires_at'),
    ...timestamps,
  },
  (table) => [
    p.index('accounts_user_id_idx').on(table.userId),
    p.index('accounts_provider_id_idx').on(table.providerId),
    p.index('accounts_provider_account_id_idx').on(table.providerId, table.accountId),
  ],
);

/** =========================
 *  TABLE: VERIFICATIONS
 *  ========================= */
export const verifications = p.pgTable(
  'verifications',
  {
    id: p.uuid('id').notNull().defaultRandom().primaryKey(),
    identifier: p.text('identifier').notNull(),
    value: p.text('value').notNull(),
    expiresAt: p.timestamp('expires_at').notNull(),
    ...timestamps,
  },
  (table) => [
    p.index('verifications_identifier_idx').on(table.identifier),
    p.index('verifications_value_idx').on(table.value),
    p.uniqueIndex('verifications_value_identifier_unique').on(table.value, table.identifier),
  ],
);

/** =========================
 *  TABLE: PASSKEYS
 *  ========================= */
export const passkeys = p.pgTable(
  'passkeys',
  {
    id: p.uuid('id').notNull().defaultRandom().primaryKey(),
    userId: p
      .uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    name: p.text('name'),
    publicKey: p.text('public_key').notNull(),
    credentialID: p.text('credential_id').notNull(),
    counter: p.integer('counter').notNull(),
    deviceType: p.text('device_type').notNull(),
    backedUp: p.boolean('backed_up').notNull(),
    transports: p.text('transports'),
    aaguid: p.text('aaguid'),
    createdAt: p.timestamp('created_at').notNull().defaultNow(),
  },
  (table) => [
    p.index('passkeys_user_id_idx').on(table.userId),
    p.index('passkeys_name_idx').on(table.name),
    p.index('passkeys_credential_id_idx').on(table.credentialID),
  ],
);

/** =========================
 *  TABLE: TWOFACTORS
 *  ========================= */
export const twoFactors = p.pgTable(
  'two_factors',
  {
    id: p.uuid('id').notNull().defaultRandom().primaryKey(),
    userId: p
      .uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    secret: p.text('secret').notNull(),
    backupCodes: p.text('backup_codes').notNull(),
  },
  (table) => [p.index('two_factors_user_id_idx').on(table.userId)],
);

/** =========================
 *  TABLE: APIKEYS
 *  ========================= */
export const apikeys = p.pgTable(
  'apikeys',
  {
    id: p.uuid('id').notNull().defaultRandom().primaryKey(),
    userId: p
      .uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    name: p.text('name'),
    start: p.text('start'),
    prefix: p.text('prefix'),
    key: p.text('key').notNull(),
    refillInterval: p.integer('refill_interval'),
    refillAmount: p.integer('refill_amount'),
    lastRefillAt: p.timestamp('last_refill_at'),
    enabled: p.boolean('enabled').default(true),
    rateLimitEnabled: p.boolean('rate_limit_enabled').default(true),
    rateLimitTimeWindow: p.integer('rate_limit_time_window').default(86400000),
    rateLimitMax: p.integer('rate_limit_max').default(10),
    requestCount: p.integer('request_count').default(0),
    remaining: p.integer('remaining'),
    lastRequest: p.timestamp('last_request'),
    permissions: p.text('permissions'),
    metadata: p.text('metadata'),
    expiresAt: p.timestamp('expires_at'),
    ...timestamps,
  },
  (table) => [
    p.index('apikeys_user_id_idx').on(table.userId),
    p.index('apikeys_key_idx').on(table.key),
    p.index('apikeys_enabled_idx').on(table.enabled),
    p.index('apikeys_last_request_idx').on(table.lastRequest),
    p.index('apikeys_expires_at_idx').on(table.expiresAt),
    p.index('apikeys_created_at_idx').on(table.createdAt),
  ],
);

/** =========================
 *  TABLE: RATELIMITS
 *  ========================= */
export const rateLimits = p.pgTable(
  'rate_limits',
  {
    id: p.uuid('id').notNull().defaultRandom().primaryKey(),
    key: p.text('key').unique(),
    count: p.integer('count'),
    lastRequest: p.bigint('last_request', { mode: 'number' }),
  },
  (table) => [
    p.index('rate_limits_last_request_idx').on(table.lastRequest),
    p.check('rate_limits_count_nonnegative', sql`${table.count} >= 0`),
  ],
);

/** =========================
 *  TABLE: DEVICE_CODES
 *  ========================= */
export const deviceCodes = p.pgTable(
  'device_codes',
  {
    id: p.uuid('id').notNull().defaultRandom().primaryKey(),
    userId: p
      .uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    deviceCode: p.text('device_code').notNull(),
    userCode: p.text('user_code').notNull(),
    clientId: p.text('client_id'),
    scope: p.text('scope'),
    status: p.text('status').notNull(),
    pollingInterval: p.integer('polling_interval'),
    lastPolledAt: p.timestamp('last_polled_at'),
    expiresAt: p.timestamp('expires_at').notNull(),
    ...timestamps,
  },
  (table) => [
    p.index('device_codes_user_id_idx').on(table.userId),
    p.index('device_codes_device_code_idx').on(table.deviceCode),
    p.index('device_codes_user_code_idx').on(table.userCode),
    p.index('device_codes_status_idx').on(table.status),
    p.index('device_codes_expires_at_idx').on(table.expiresAt),
    p.index('device_codes_created_at_idx').on(table.createdAt),
  ],
);
