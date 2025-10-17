import type { AnyUseQueryOptions, QueryKey } from '@pelatform/ui/re/tanstack-query';

export type AuthQueryOptions = {
  /**
   * The default query options for all queries.
   */
  queryOptions?: Partial<AnyUseQueryOptions>;
  /**
   * The default query options for session queries.
   */
  sessionQueryOptions?: Partial<AnyUseQueryOptions>;
  /**
   * The default query options for token queries.
   */
  tokenQueryOptions?: Partial<AnyUseQueryOptions>;
  /**
   * Whether to use optimistic updates for mutations.
   */
  optimistic: boolean;
  /**
   * Whether to refetch queries on mutations.
   */
  refetchOnMutate: boolean;
  /**
   * The query key for account info.
   */
  accountInfoKey: QueryKey;
  /**
   * The query key for active organization.
   */
  activeOrganizationKey: QueryKey;
  /**
   * The query key for has permission.
   */
  hasPermissionKey: QueryKey;
  /**
   * The query key for invitation.
   */
  invitationKey: QueryKey;
  /**
   * The query key for organizations.
   */
  organizationsKey: QueryKey;
  /**
   * The query key for list accounts.
   */
  listAccountsKey: QueryKey;
  /**
   * The query key for list API keys.
   */
  listApiKeysKey: QueryKey;
  /**
   * The query key for list device sessions.
   */
  listDeviceSessionsKey: QueryKey;
  /**
   * The query key for list invitations.
   */
  listInvitationsKey: QueryKey;
  /**
   * The query key for list members.
   */
  listMembersKey: QueryKey;
  /**
   * The query key for list passkeys.
   */
  listPasskeysKey: QueryKey;
  /**
   * The query key for list sessions.
   */
  listSessionsKey: QueryKey;
  /**
   * The query key for list user invitations.
   */
  listUserInvitationsKey: QueryKey;
  /**
   * The query key for session.
   */
  sessionKey: QueryKey;
  /**
   * The query key for token.
   */
  tokenKey: QueryKey;
};

export const defaultAuthQueryOptions: AuthQueryOptions = {
  optimistic: true,
  refetchOnMutate: true,
  accountInfoKey: ['account-info'],
  activeOrganizationKey: ['active-organization'],
  hasPermissionKey: ['has-permission'],
  invitationKey: ['invitation'],
  organizationsKey: ['organizations'],
  listAccountsKey: ['list-accounts'],
  listApiKeysKey: ['list-api-keys'],
  listDeviceSessionsKey: ['list-device-sessions'],
  listInvitationsKey: ['list-invitations'],
  listMembersKey: ['list-members'],
  listPasskeysKey: ['list-passkeys'],
  listSessionsKey: ['list-sessions'],
  listUserInvitationsKey: ['list-user-invitations'],
  sessionKey: ['session'],
  tokenKey: ['token'],
};
