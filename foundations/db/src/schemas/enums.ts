import * as p from 'drizzle-orm/pg-core';

export const userStatusEnum = p.pgEnum('user_status', ['ACTIVE', 'INACTIVE', 'BLOCKED', 'DELETED']);
export type UserStatus = (typeof userStatusEnum.enumValues)[number];

export const organizationStatusEnum = p.pgEnum('organization_status', [
  'ACTIVE',
  'SUSPENDED',
  'ARCHIVED',
  'PENDING',
  'DELETED',
]);
export type OrganizationStatus = (typeof organizationStatusEnum.enumValues)[number];

export const projectStatusEnum = p.pgEnum('project_status', [
  'ACTIVE',
  'INACTIVE',
  'ARCHIVED',
  'DELETED',
]);
export type ProjectStatus = (typeof projectStatusEnum.enumValues)[number];

export const subscriptionStatusEnum = p.pgEnum('subscription_status', [
  'ACTIVE',
  'TRIALING',
  'PAST_DUE',
  'CANCELED',
  'EXPIRED',
]);
export type SubscriptionStatus = (typeof subscriptionStatusEnum.enumValues)[number];

export const tokenStatusEnum = p.pgEnum('token_status', [
  'ACTIVE',
  'INACTIVE',
  'EXPIRED',
  'REVOKED',
  'SUSPENDED',
]);
export type TokenStatus = (typeof tokenStatusEnum.enumValues)[number];
