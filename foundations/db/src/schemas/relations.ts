import { relations } from 'drizzle-orm';

import {
  invitations,
  members,
  organizations,
  projects,
  subscriptions,
  tokens,
  webhooks,
} from './organizations';
import { accounts, apikeys, deviceCodes, passkeys, sessions, twoFactors, users } from './users';

export const userRelations = relations(users, ({ many }) => ({
  sessions: many(sessions), // Active sessions across devices
  accounts: many(accounts), // OAuth accounts (Google, GitHub, etc.)
  passkeys: many(passkeys), // Passkey authentication (WebAuthn/FIDO2)
  twoFactor: many(twoFactors), // Two-factor authentication (TOTP)
  apikeys: many(apikeys), // API keys
  deviceCodes: many(deviceCodes), // Device codes for authentication

  ownedOrgs: many(organizations), // Workspaces where this user is the owner
  invitations: many(invitations), // Invitations to join workspaces
  members: many(members), // Members in workspaces
  subscriptions: many(subscriptions), // Subscriptions user
  createdProjects: many(projects), // Projects created by this user
  createdTokens: many(tokens), // Token created by this user
  createdWebhooks: many(webhooks), // Webhooks created by this user
}));

export const sessionRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const accountRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const passkeyRelations = relations(passkeys, ({ one }) => ({
  user: one(users, {
    fields: [passkeys.userId],
    references: [users.id],
  }),
}));

export const twoFactorRelations = relations(twoFactors, ({ one }) => ({
  user: one(users, {
    fields: [twoFactors.userId],
    references: [users.id],
  }),
}));

export const apikeyRelations = relations(apikeys, ({ one }) => ({
  user: one(users, {
    fields: [apikeys.userId],
    references: [users.id],
  }),
}));

export const deviceCodeRelations = relations(deviceCodes, ({ one }) => ({
  user: one(users, {
    fields: [deviceCodes.userId],
    references: [users.id],
  }),
}));

export const organizationRelations = relations(organizations, ({ one, many }) => ({
  owner: one(users, {
    fields: [organizations.ownerId],
    references: [users.id],
  }),
  invitations: many(invitations),
  members: many(members),
  projects: many(projects),
  subscription: one(subscriptions, {
    fields: [organizations.id],
    references: [subscriptions.organizationId],
  }),
  tokens: many(tokens),
  webhooks: many(webhooks),
}));

export const memberRelations = relations(members, ({ one }) => ({
  organization: one(organizations, {
    fields: [members.organizationId],
    references: [organizations.id],
  }),
  user: one(users, {
    fields: [members.userId],
    references: [users.id],
  }),
}));

export const invitationRelations = relations(invitations, ({ one }) => ({
  organization: one(organizations, {
    fields: [invitations.organizationId],
    references: [organizations.id],
  }),
  inviter: one(users, {
    fields: [invitations.inviterId],
    references: [users.id],
  }),
}));

export const projectRelations = relations(projects, ({ one }) => ({
  organization: one(organizations, {
    fields: [projects.organizationId],
    references: [organizations.id],
  }),
  createdByUser: one(users, {
    fields: [projects.createdBy],
    references: [users.id],
  }),
}));

export const subscriptionRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, {
    fields: [subscriptions.userId],
    references: [users.id],
  }),
  organization: one(organizations, {
    fields: [subscriptions.organizationId],
    references: [organizations.id],
  }),
}));

export const tokenRelations = relations(tokens, ({ one }) => ({
  organization: one(organizations, {
    fields: [tokens.organizationId],
    references: [organizations.id],
  }),
  createdByUser: one(users, {
    fields: [tokens.createdBy],
    references: [users.id],
  }),
}));

export const webhookRelations = relations(webhooks, ({ one }) => ({
  organization: one(organizations, {
    fields: [webhooks.organizationId],
    references: [organizations.id],
  }),
  createdByUser: one(users, {
    fields: [webhooks.createdBy],
    references: [users.id],
  }),
}));
