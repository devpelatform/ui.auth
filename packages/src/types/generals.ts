/* @private */

export type ApiKey = {
  id: string;
  name?: string | null;
  start?: string | null;
  expiresAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, unknown> | null;
};

export type Invitation = {
  id: string;
  organizationId: string;
  email: string;
  role: string;
  status: string;
  inviterId: string;
  expiresAt: Date;
  teamId?: string | undefined;
};

export type PasswordValidation = {
  maxLength?: number;
  minLength?: number;
  regex?: RegExp;
};

export type Profile = {
  id?: string | number;
  email?: string | null;
  name?: string | null;
  displayUsername?: string | null;
  username?: string | null;
  displayName?: string | null;
  firstName?: string | null;
  fullName?: string | null;
  isAnonymous?: boolean | null;
  emailVerified?: boolean | null;
  image?: string | null;
  avatar?: string | null;
  avatarUrl?: string | null;
};

export type FetchError = {
  code?: string | undefined;
  message?: string | undefined;
  status?: number;
  statusText?: string;
};

export type Refetch = () => Promise<unknown> | unknown;

export type NonThrowableResult = {
  data: {
    status?: boolean;
    success?: boolean;
    [key: string]: unknown;
  } | null;
  error: {
    code?: string | undefined;
    message?: string | undefined;
    status: number;
    statusText: string;
  } | null;
};

export type ThrowableResult = { status?: boolean; [key: string]: unknown };
