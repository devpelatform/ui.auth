import { createSelectSchema, createUpdateSchema } from 'drizzle-zod';
import { z } from 'zod';

import { contacts, emailLogs } from './schemas/generals';
import {
  invitations,
  members,
  organizations,
  projects,
  subscriptions,
  tokens,
  webhooks,
} from './schemas/organizations';
import {
  accounts,
  apikeys,
  deviceCodes,
  passkeys,
  rateLimits,
  sessions,
  twoFactors,
  users,
  verifications,
} from './schemas/users';

export const ContactsSchema = createSelectSchema(contacts);

export const EmailLogsSchema = createSelectSchema(emailLogs);

export const InvitationSchema = createSelectSchema(invitations);

export const MemberSchema = createSelectSchema(members);

export const OrganizationSchema = createSelectSchema(organizations);
export const OrganizationUpdateSchema = createUpdateSchema(organizations, {
  id: z.string(),
});

export const ProjectSchema = createSelectSchema(projects);
export const ProjectUpdateSchema = createUpdateSchema(projects, {
  id: z.string(),
});

export const SubscriptionSchema = createSelectSchema(subscriptions);
export const SubscriptionUpdateSchema = createUpdateSchema(subscriptions, {
  id: z.string(),
});

export const TokenSchema = createSelectSchema(tokens);
export const TokenUpdateSchema = createUpdateSchema(tokens, {
  id: z.string(),
});

export const WebhookSchema = createSelectSchema(webhooks);
export const WebhookUpdateSchema = createUpdateSchema(webhooks, {
  id: z.string(),
});

export const AccountSchema = createSelectSchema(accounts);

export const ApikeySchema = createSelectSchema(apikeys);
export const ApikeyUpdateSchema = createUpdateSchema(apikeys, {
  id: z.string(),
});

export const DeviceCodeSchema = createSelectSchema(deviceCodes);
export const DeviceCodeUpdateSchema = createUpdateSchema(deviceCodes, {
  id: z.string(),
});

export const PasskeySchema = createSelectSchema(passkeys);

export const RateLimitSchema = createSelectSchema(rateLimits);

export const SessionSchema = createSelectSchema(sessions);

export const TwoFactorSchema = createSelectSchema(twoFactors);

export const UserSchema = createSelectSchema(users);
export const UserUpdateSchema = createUpdateSchema(users, {
  id: z.string(),
});

export const VerificationSchema = createSelectSchema(verifications);
