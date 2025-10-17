import { useContext } from 'react';

import type { AnyUseQueryOptions, QueryKey } from '@pelatform/ui/re/tanstack-query';
import { useQueryClient } from '@pelatform/ui/re/tanstack-query';
import { AuthQueryContext } from '@/hooks';
import {
  type BetterFetchRequest,
  useAccountInfo,
  useActiveOrganization,
  useAuthMutation,
  useAuthQuery,
  useCreateApiKey,
  useDeleteApiKey,
  useDeletePasskey,
  useHasPermission,
  useInvitation,
  useListAccounts,
  useListApiKeys,
  useListDeviceSessions,
  useListInvitations,
  useListMembers,
  useListOrganizations,
  useListPasskeys,
  useListSessions,
  useListUserInvitations,
  useRevokeDeviceSession,
  useRevokeOtherSessions,
  useRevokeSession,
  useRevokeSessions,
  useSession,
  useSetActiveSession,
  useToken,
  useUnlinkAccount,
  useUpdateOrganization,
  useUpdateUser,
} from '@/hooks/main';
import type { AnyAuthClient, AuthClient } from '@/types/auth';
import type { AuthQueryOptions } from '@/types/query';
import { prefetchSession } from './prefetch-session';

export function createAuthHooks<TAuthClient extends AnyAuthClient>(authClient: TAuthClient) {
  return {
    useAccountInfo: <T extends TAuthClient>(
      params: Parameters<AuthClient['accountInfo']>[0],
      options?: Partial<AnyUseQueryOptions>,
    ) => useAccountInfo(authClient as T, params, options),
    useListAccounts: <T extends TAuthClient>(options?: Partial<AnyUseQueryOptions>) =>
      useListAccounts(authClient as T, options),
    useUnlinkAccount: <T extends TAuthClient>() => useUnlinkAccount(authClient as T),

    useCreateApiKey: (options?: Partial<AuthQueryOptions>) =>
      useCreateApiKey(authClient as AuthClient, options),
    useDeleteApiKey: (options?: Partial<AuthQueryOptions>) =>
      useDeleteApiKey(authClient as AuthClient, options),
    useListApiKeys: (options?: Partial<AnyUseQueryOptions>) =>
      useListApiKeys(authClient as AuthClient, options),

    useListDeviceSessions: (options?: Partial<AnyUseQueryOptions>) =>
      useListDeviceSessions(authClient as AuthClient, options),
    useRevokeDeviceSession: (options?: Partial<AuthQueryOptions>) =>
      useRevokeDeviceSession(authClient as AuthClient, options),
    useSetActiveSession: (options?: Partial<AuthQueryOptions>) =>
      useSetActiveSession(authClient as AuthClient, options),

    useActiveOrganization: (options?: Partial<AnyUseQueryOptions>) =>
      useActiveOrganization(authClient as AuthClient, options),
    useListOrganizations: (options?: Partial<AnyUseQueryOptions>) =>
      useListOrganizations(authClient as AuthClient, options),
    useUpdateOrganization: (options?: Partial<AuthQueryOptions>) =>
      useUpdateOrganization(authClient as AuthClient, options),
    useHasPermission: (
      params: Parameters<AuthClient['organization']['hasPermission']>[0],
      options?: Partial<AnyUseQueryOptions>,
    ) => useHasPermission(authClient as AuthClient, params, options),
    useInvitation: (
      params: Parameters<AuthClient['organization']['getInvitation']>[0],
      options?: Partial<AnyUseQueryOptions>,
    ) => useInvitation(authClient as AuthClient, params, options),
    useListInvitations: (
      params: Parameters<AuthClient['organization']['listInvitations']>[0],
      options?: Partial<AnyUseQueryOptions>,
    ) => useListInvitations(authClient as AuthClient, params, options),
    useListUserInvitations: (options?: Partial<AnyUseQueryOptions>) =>
      useListUserInvitations(authClient as AuthClient, options),
    useListMembers: (
      params: Parameters<AuthClient['organization']['listMembers']>[0],
      options?: Partial<AnyUseQueryOptions>,
    ) => useListMembers(authClient as AuthClient, params, options),

    useDeletePasskey: (options?: Partial<AuthQueryOptions>) =>
      useDeletePasskey(authClient as AuthClient, options),
    useListPasskeys: (options?: Partial<AnyUseQueryOptions>) =>
      useListPasskeys(authClient as AuthClient, options),

    useListSessions: <T extends TAuthClient>(options?: Partial<AnyUseQueryOptions>) =>
      useListSessions(authClient as T, options),
    useRevokeOtherSessions: <T extends TAuthClient>(options?: Partial<AuthQueryOptions>) =>
      useRevokeOtherSessions(authClient as T, options),
    useRevokeSession: <T extends TAuthClient>(options?: Partial<AuthQueryOptions>) =>
      useRevokeSession(authClient as T, options),
    useRevokeSessions: <T extends TAuthClient>(options?: Partial<AuthQueryOptions>) =>
      useRevokeSessions(authClient as T, options),
    useSession: <T extends TAuthClient>(options?: Partial<AnyUseQueryOptions>) =>
      useSession(authClient as T, options),
    useUpdateUser: <T extends TAuthClient>(options?: Partial<AuthQueryOptions>) =>
      useUpdateUser(authClient as T, options),

    useToken: <T extends TAuthClient>(options?: Partial<AnyUseQueryOptions>) =>
      useToken(authClient as T, options),

    useAuthMutation: useAuthMutation,
    useAuthQuery: <TData>({
      queryKey,
      queryFn,
      options,
    }: {
      queryKey: QueryKey;
      queryFn: BetterFetchRequest<TData>;
      options?: Partial<AnyUseQueryOptions>;
    }) => useAuthQuery({ authClient, queryKey, queryFn, options }),

    usePrefetchSession: <T extends TAuthClient>(options?: Partial<AnyUseQueryOptions>) => {
      const queryClient = useQueryClient();
      const queryOptions = useContext(AuthQueryContext);

      return {
        prefetch: () => prefetchSession(authClient as T, queryClient, queryOptions, options),
      };
    },
  };
}
