import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';

import type { contacts, emailLogs } from './schemas/generals';
import type {
  invitations,
  members,
  organizations,
  projects,
  subscriptions,
  tokens,
  webhooks,
} from './schemas/organizations';
import type {
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

export type Contacts = InferSelectModel<typeof contacts>;
export type ContactsInsert = InferInsertModel<typeof contacts>;

export type EmailLogs = InferSelectModel<typeof emailLogs>;
export type EmailLogsInsert = InferInsertModel<typeof emailLogs>;

export type Invitation = InferSelectModel<typeof invitations>;
export type InvitationInsert = InferInsertModel<typeof invitations>;

export type Member = InferSelectModel<typeof members>;
export type MemberInsert = InferInsertModel<typeof members>;

export type Organization = InferSelectModel<typeof organizations>;
export type OrganizationInsert = InferInsertModel<typeof organizations>;

export type Project = InferSelectModel<typeof projects>;
export type ProjectInsert = InferInsertModel<typeof projects>;

export type Subscription = InferSelectModel<typeof subscriptions>;
export type SubscriptionInsert = InferInsertModel<typeof subscriptions>;

export type Token = InferSelectModel<typeof tokens>;
export type TokenInsert = InferInsertModel<typeof tokens>;

export type Webhook = InferSelectModel<typeof webhooks>;
export type WebhookInsert = InferInsertModel<typeof webhooks>;

export type Account = InferSelectModel<typeof accounts>;
export type AccountInsert = InferInsertModel<typeof accounts>;

export type Apikey = InferSelectModel<typeof apikeys>;
export type ApikeyInsert = InferInsertModel<typeof apikeys>;

export type DeviceCode = InferSelectModel<typeof deviceCodes>;
export type DeviceCodeInsert = InferInsertModel<typeof deviceCodes>;

export type Passkey = InferSelectModel<typeof passkeys>;
export type PasskeyInsert = InferInsertModel<typeof passkeys>;

export type RateLimit = InferSelectModel<typeof rateLimits>;
export type RateLimitInsert = InferInsertModel<typeof rateLimits>;

export type Session = InferSelectModel<typeof sessions>;
export type SessionInsert = InferInsertModel<typeof sessions>;

export type TwoFactor = InferSelectModel<typeof twoFactors>;
export type TwoFactorInsert = InferInsertModel<typeof twoFactors>;

export type User = InferSelectModel<typeof users>;
export type UserInsert = InferInsertModel<typeof users>;

export type Verification = InferSelectModel<typeof verifications>;
export type VerificationInsert = InferInsertModel<typeof verifications>;

// export type Workspace = {
//   id: string;
//   name: string;
//   slug: string;
//   logo: string;
//   createdAt: Date | string;
//   status: OrganizationStatus;
//   timezone: string | null;
//   currentUserRole: string | null;
//   members: Array<{
//     id: string;
//     organizationId: string;
//     userId: string;
//     role: string;
//     createdAt: Date | string;
//     user: {
//       id: string;
//       name: string | null;
//       email: string;
//       image: string | null;
//     };
//   }>;
//   invitations?: Array<{
//     id: string;
//     organizationId: string;
//     inviterId: string;
//     email: string;
//     role: string | null;
//     status: string;
//     expiresAt: Date | string;
//   }>;
//   subscription: {
//     id: string;
//     status: string;
//     plan: string;
//     currentPeriodStart?: string | Date;
//     currentPeriodEnd?: string | Date;
//     cancelAtPeriodEnd?: boolean;
//     canceledAt?: string | Date | null;
//   } | null;
// };

// export type UserProfile = {
//   id: string;
//   name: string;
//   email: string;
//   emailVerified: boolean;
//   image?: string | null;
//   createdAt: Date;
//   updatedAt: Date;
//   username: string | null;
//   role: string | null;
//   status: UserStatus;
//   workspaceRole: string | null;
//   activeWorkspace: {
//     id: string;
//     name: string;
//     slug: string;
//   } | null;
// };
