import type { auth } from './auth';
import type { authClient } from './client';

export type Auth = typeof auth;
export type AuthClient = typeof authClient;

export type Session = typeof auth.$Infer.Session;

export type Organization = typeof authClient.$Infer.Organization;
export type Invitation = typeof authClient.$Infer.Invitation;
export type ActiveOrganization = typeof authClient.$Infer.ActiveOrganization;

export type AuthClientErrorCodes = typeof authClient.$ERROR_CODES & {
  INVALID_INVITATION: string;
};
