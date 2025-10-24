/* @private */

import { useCallback, useContext, useEffect, useMemo } from 'react';
import { skipToken } from '@tanstack/query-core';
import type { BetterFetchOption } from 'better-auth/react';

import {
  type AnyUseQueryOptions,
  type Query,
  type QueryClient,
  type QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from '@pelatform/ui/re/tanstack-query';
import type { AnyAuthClient, AuthClient, BetterFetchRequest } from '../types/auth';
import type { NonThrowableResult, ThrowableResult } from '../types/generals';
import type { AuthQueryOptions } from '../types/query';
import { AuthQueryContext } from './main';

/** =========================
 *  ACCOUNTS
 *  ========================= */
export function useAccountInfo<TAuthClient extends AnyAuthClient>(
  authClient: TAuthClient,
  params: Parameters<AuthClient['accountInfo']>[0],
  options?: Partial<AnyUseQueryOptions>,
) {
  const { accountInfoKey } = useContext(AuthQueryContext);
  const queryKey = [accountInfoKey, JSON.stringify(params)];

  return useAuthQuery({
    authClient,
    queryKey,
    queryFn: (fnParams) =>
      authClient.accountInfo({
        ...params,
        ...fnParams,
      }),
    options,
  });
}

export function useListAccounts<TAuthClient extends AnyAuthClient>(
  authClient: TAuthClient,
  options?: Partial<AnyUseQueryOptions>,
) {
  const { listAccountsKey: queryKey } = useContext(AuthQueryContext);

  return useAuthQuery({
    authClient,
    queryKey,
    queryFn: authClient.listAccounts,
    options,
  });
}

export function useUnlinkAccount<TAuthClient extends AnyAuthClient>(
  authClient: TAuthClient,
  options?: Partial<AuthQueryOptions>,
) {
  const { listAccountsKey: queryKey } = useContext(AuthQueryContext);

  return useAuthMutation({
    queryKey,
    mutationFn: authClient.unlinkAccount,
    options,
  });
}

/** =========================
 *  APIKEYS
 *  ========================= */
export function useCreateApiKey<TAuthClient extends AuthClient>(
  authClient: TAuthClient,
  options?: Partial<AuthQueryOptions>,
) {
  const { listApiKeysKey: queryKey } = useContext(AuthQueryContext);

  return useAuthMutation({
    queryKey,
    mutationFn: authClient.apiKey.create,
    options,
  });
}

export function useDeleteApiKey<TAuthClient extends AuthClient>(
  authClient: TAuthClient,
  options?: Partial<AuthQueryOptions>,
) {
  const { listApiKeysKey: queryKey } = useContext(AuthQueryContext);

  return useAuthMutation({
    queryKey,
    mutationFn: authClient.apiKey.delete,
    options,
  });
}

export function useListApiKeys<TAuthClient extends AuthClient>(
  authClient: TAuthClient,
  options?: Partial<AnyUseQueryOptions>,
) {
  const { listApiKeysKey: queryKey } = useContext(AuthQueryContext);

  return useAuthQuery({
    authClient,
    queryKey,
    queryFn: authClient.apiKey.list,
    options,
  });
}

/** =========================
 *  DEVICE SESSIONS
 *  ========================= */
export function useListDeviceSessions<TAuthClient extends AuthClient>(
  authClient: TAuthClient,
  options?: Partial<AnyUseQueryOptions>,
) {
  const { listDeviceSessionsKey: queryKey } = useContext(AuthQueryContext);

  return useAuthQuery({
    authClient,
    queryKey,
    queryFn: authClient.multiSession.listDeviceSessions,
    options,
  });
}

export function useRevokeDeviceSession<TAuthClient extends AuthClient>(
  authClient: TAuthClient,
  options?: Partial<AuthQueryOptions>,
) {
  const { listDeviceSessionsKey: queryKey } = useContext(AuthQueryContext);

  return useAuthMutation({
    queryKey,
    mutationFn: authClient.multiSession.revoke,
    options,
  });
}

export function useSetActiveSession<TAuthClient extends AuthClient>(
  authClient: TAuthClient,
  options?: Partial<AuthQueryOptions>,
) {
  type SetActiveSessionParams = Parameters<TAuthClient['multiSession']['setActive']>[0];

  const queryClient = useQueryClient();
  const { onMutateError } = useOnMutateError();
  const context = useContext(AuthQueryContext);
  const { listDeviceSessionsKey: queryKey } = { ...context, ...options };

  const mutation = useMutation({
    mutationFn: ({ fetchOptions = { throw: true }, ...params }: SetActiveSessionParams) =>
      authClient.multiSession.setActive({ fetchOptions, ...params }),
    onError: (error) => onMutateError(error, queryKey),
    onSettled: () => queryClient.clear(),
  });

  const {
    mutate: setActiveSession,
    mutateAsync: setActiveSessionAsync,
    isPending: setActiveSessionPending,
    error: setActiveSessionError,
  } = mutation;

  return {
    ...mutation,
    setActiveSession,
    setActiveSessionAsync,
    setActiveSessionPending,
    setActiveSessionError,
  };
}

/** =========================
 *  ORGANIZATIONS
 *  ========================= */
export function useActiveOrganization<TAuthClient extends AuthClient>(
  authClient: TAuthClient,
  options?: Partial<AnyUseQueryOptions>,
) {
  const { activeOrganizationKey: queryKey } = useContext(AuthQueryContext);

  return useAuthQuery({
    authClient,
    queryKey,
    queryFn: authClient.organization.getFullOrganization,
    options,
  });
}

export function useListOrganizations<TAuthClient extends AuthClient>(
  authClient: TAuthClient,
  options?: Partial<AnyUseQueryOptions>,
) {
  const { organizationsKey: queryKey } = useContext(AuthQueryContext);

  return useAuthQuery({
    authClient,
    queryKey,
    queryFn: authClient.organization.list,
    options,
  });
}

export function useUpdateOrganization<TAuthClient extends AnyAuthClient>(
  authClient: TAuthClient,
  options?: Partial<AuthQueryOptions>,
) {
  const { activeOrganizationKey, organizationsKey } = useContext(AuthQueryContext);

  return useAuthMutation({
    queryKey: [activeOrganizationKey, organizationsKey],
    mutationFn: (authClient as AuthClient).organization.update,
    optimisticData: (params) => ({
      data: { ...params },
    }),
    options,
  });
}

export function useHasPermission<TAuthClient extends AnyAuthClient>(
  authClient: TAuthClient,
  params: Parameters<AuthClient['organization']['hasPermission']>[0],
  options?: Partial<AnyUseQueryOptions>,
) {
  const { hasPermissionKey } = useContext(AuthQueryContext);
  const queryKey = [hasPermissionKey, JSON.stringify(params)];

  return useAuthQuery({
    authClient,
    queryKey,
    queryFn: (fnParams) =>
      (authClient as AuthClient).organization.hasPermission({
        ...params,
        ...fnParams,
      }),
    options,
  });
}

export function useInvitation<TAuthClient extends AnyAuthClient>(
  authClient: TAuthClient,
  params: Parameters<AuthClient['organization']['getInvitation']>[0],
  options?: Partial<AnyUseQueryOptions>,
) {
  const { invitationKey } = useContext(AuthQueryContext);
  const queryKey = [invitationKey, JSON.stringify(params)];

  return useAuthQuery({
    authClient,
    queryKey,
    queryFn: (fnParams) =>
      (authClient as AuthClient).organization.getInvitation({
        ...params,
        ...fnParams,
      }),
    options,
  });
}

export function useListInvitations<TAuthClient extends AnyAuthClient>(
  authClient: TAuthClient,
  params: Parameters<AuthClient['organization']['listInvitations']>[0],
  options?: Partial<AnyUseQueryOptions>,
) {
  const { listInvitationsKey } = useContext(AuthQueryContext);
  const queryKey = [listInvitationsKey, JSON.stringify(params)];

  return useAuthQuery({
    authClient,
    queryKey,
    queryFn: (fnParams) =>
      (authClient as AuthClient).organization.listInvitations({
        ...params,
        ...fnParams,
      }),
    options,
  });
}

export function useListUserInvitations<TAuthClient extends AuthClient>(
  authClient: TAuthClient,
  options?: Partial<AnyUseQueryOptions>,
) {
  const { listUserInvitationsKey: queryKey } = useContext(AuthQueryContext);

  return useAuthQuery({
    authClient,
    queryKey,
    queryFn: authClient.organization.listUserInvitations,
    options,
  });
}

export function useListMembers<TAuthClient extends AnyAuthClient>(
  authClient: TAuthClient,
  params: Parameters<AuthClient['organization']['listMembers']>[0],
  options?: Partial<AnyUseQueryOptions>,
) {
  const { listMembersKey } = useContext(AuthQueryContext);
  const queryKey = [listMembersKey, JSON.stringify(params)];

  return useAuthQuery({
    authClient,
    queryKey,
    queryFn: (fnParams) =>
      (authClient as AuthClient).organization.listMembers({
        ...params,
        ...fnParams,
      }),
    options,
  });
}

/** =========================
 * PASSKEYS
 *  ========================= */
export function useDeletePasskey<TAuthClient extends AuthClient>(
  authClient: TAuthClient,
  options?: Partial<AuthQueryOptions>,
) {
  const { listPasskeysKey: queryKey } = useContext(AuthQueryContext);

  return useAuthMutation({
    queryKey,
    mutationFn: authClient.passkey.deletePasskey,
    options,
  });
}

export function useListPasskeys<TAuthClient extends AuthClient>(
  authClient: TAuthClient,
  options?: Partial<AnyUseQueryOptions>,
) {
  const { listPasskeysKey: queryKey } = useContext(AuthQueryContext);

  return useAuthQuery({
    authClient,
    queryKey,
    queryFn: authClient.passkey.listUserPasskeys,
    options,
  });
}

/** =========================
 *  SESSIONS
 *  ========================= */
export function useListSessions<TAuthClient extends AnyAuthClient>(
  authClient: TAuthClient,
  options?: Partial<AnyUseQueryOptions>,
) {
  const { listSessionsKey: queryKey } = useContext(AuthQueryContext);
  return useAuthQuery({
    authClient,
    queryKey,
    queryFn: authClient.listSessions,
    options,
  });
}

export function useRevokeOtherSessions<TAuthClient extends AnyAuthClient>(
  authClient: TAuthClient,
  options?: Partial<AuthQueryOptions>,
) {
  const { listSessionsKey: queryKey } = useContext(AuthQueryContext);

  return useAuthMutation({
    queryKey,
    mutationFn: authClient.revokeOtherSessions,
    options,
  });
}

export function useRevokeSession<TAuthClient extends AnyAuthClient>(
  authClient: TAuthClient,
  options?: Partial<AuthQueryOptions>,
) {
  const { listSessionsKey: queryKey } = useContext(AuthQueryContext);

  return useAuthMutation({
    queryKey,
    mutationFn: authClient.revokeSession,
    options,
  });
}

export function useRevokeSessions<TAuthClient extends AnyAuthClient>(
  authClient: TAuthClient,
  options?: Partial<AuthQueryOptions>,
) {
  const { listSessionsKey: queryKey } = useContext(AuthQueryContext);

  return useAuthMutation({
    queryKey,
    mutationFn: authClient.revokeSessions,
    options,
  });
}

export function useSession<TAuthClient extends AnyAuthClient>(
  authClient: TAuthClient,
  options?: Partial<AnyUseQueryOptions>,
) {
  type SessionData = TAuthClient['$Infer']['Session'];
  type User = TAuthClient['$Infer']['Session']['user'];
  type Session = TAuthClient['$Infer']['Session']['session'];

  const { sessionQueryOptions, sessionKey: queryKey, queryOptions } = useContext(AuthQueryContext);
  const mergedOptions = { ...queryOptions, ...sessionQueryOptions, ...options };

  const result = useQuery<SessionData>({
    queryKey,
    queryFn: () => (authClient as AuthClient).getSession({ fetchOptions: { throw: true } }),
    ...mergedOptions,
  });

  return {
    ...result,
    session: result.data?.session as Session | undefined,
    user: result.data?.user as User | undefined,
  };
}

export function useUpdateUser<TAuthClient extends AnyAuthClient>(
  authClient: TAuthClient,
  options?: Partial<AuthQueryOptions>,
) {
  type SessionData = TAuthClient['$Infer']['Session'];

  const { sessionKey: queryKey } = useContext(AuthQueryContext);

  return useAuthMutation({
    queryKey,
    mutationFn: authClient.updateUser,
    optimisticData: (params, previousSession: SessionData) => ({
      ...previousSession,
      user: { ...previousSession.user, ...params },
    }),
    options,
  });
}

export async function prefetchSession<TAuthClient extends AnyAuthClient>(
  authClient: TAuthClient,
  queryClient: QueryClient,
  queryOptions?: AuthQueryOptions,
  options?: Partial<AnyUseQueryOptions>,
) {
  const { error, data } = await (authClient as AuthClient).getSession();

  const mergedOptions = {
    ...queryOptions?.queryOptions,
    ...queryOptions?.sessionQueryOptions,
    ...options,
  };

  await queryClient.prefetchQuery({
    ...mergedOptions,
    queryKey: queryOptions?.sessionKey,
    queryFn: () => data as SessionData,
  });

  type SessionData = TAuthClient['$Infer']['Session'];
  type User = TAuthClient['$Infer']['Session']['user'];
  type Session = TAuthClient['$Infer']['Session']['session'];

  return {
    error,
    data: data,
    session: data?.session as Session | undefined,
    user: data?.user as User | undefined,
  };
}

/** =========================
 *  SHARED
 *  ========================= */
const decodeJwt = (token: string) => {
  const decode = (data: string) => {
    if (typeof Buffer === 'undefined') {
      return atob(data);
    }

    return Buffer.from(data, 'base64').toString();
  };

  const parts = token.split('.').map((part) => decode(part.replace(/-/g, '+').replace(/_/g, '/')));
  return JSON.parse(parts[1]);
};

export function useToken<TAuthClient extends AnyAuthClient>(
  authClient: TAuthClient,
  options?: Partial<AnyUseQueryOptions>,
) {
  const { data: sessionData } = useSession(authClient, options);
  const { tokenKey, tokenQueryOptions, queryOptions } = useContext(AuthQueryContext);
  const mergedOptions = { ...queryOptions, ...tokenQueryOptions, ...options };

  const queryResult = useAuthQuery<{ token: string }>({
    authClient,
    queryKey: tokenKey,
    queryFn: ({ fetchOptions }) => authClient.$fetch('/token', fetchOptions),
    options: {
      enabled: !!sessionData && (mergedOptions.enabled ?? true),
    },
  });

  const { data, refetch, ...rest } = queryResult;
  const payload = useMemo(() => (data ? decodeJwt(data.token) : null), [data]);

  useEffect(() => {
    if (!data?.token) return;

    const payload = decodeJwt(data.token);
    if (!payload?.exp) return;

    const expiresAt = payload.exp * 1000;
    const expiresIn = expiresAt - Date.now();

    const timeout = setTimeout(() => refetch(), expiresIn);

    return () => clearTimeout(timeout);
  }, [data, refetch]);

  const isTokenExpired = useCallback(() => {
    if (!data?.token) return true;

    const payload = decodeJwt(data.token);
    if (!payload?.exp) return true;

    return payload.exp < Date.now() / 1000;
  }, [data]);

  useEffect(() => {
    if (!sessionData) return;

    if (payload?.sub !== sessionData.user.id) {
      refetch();
    }
  }, [payload, sessionData, refetch]);

  const tokenData = useMemo(
    () =>
      !sessionData || isTokenExpired() || sessionData?.user.id !== payload?.sub ? undefined : data,
    [sessionData, isTokenExpired, payload, data],
  );

  return { ...rest, data: tokenData, token: tokenData?.token, payload };
}

type AuthMutationFn<TParams> = (params: TParams) => Promise<ThrowableResult | NonThrowableResult>;

export function useAuthMutation<
  // biome-ignore lint/suspicious/noExplicitAny: disable
  TAuthFn extends AuthMutationFn<any>,
>({
  queryKey,
  mutationFn,
  optimisticData,
  options,
}: {
  queryKey: QueryKey;
  mutationFn: TAuthFn;
  optimisticData?(
    params: Omit<Parameters<TAuthFn>[0], 'fetchOptions'>,
    previousData: unknown,
  ): unknown;
  options?: Partial<AuthQueryOptions>;
}) {
  type TParams = Parameters<TAuthFn>[0];
  const queryClient = useQueryClient();
  const context = useContext(AuthQueryContext);
  const { optimistic } = { ...context, ...options };
  const { onMutateError } = useOnMutateError();

  const mutation = useMutation({
    mutationFn: ({ fetchOptions = { throw: true }, ...params }: TParams) =>
      mutationFn({ fetchOptions, ...params }),
    onMutate: async (params: TParams) => {
      if (!optimistic || !optimisticData) return;
      await queryClient.cancelQueries({ queryKey });

      const previousData = queryClient.getQueryData(queryKey);
      if (!previousData) return;

      queryClient.setQueryData(queryKey, () => optimisticData(params, previousData));
      return { previousData };
    },
    onError: (error, _, context) => onMutateError(error, queryKey, context),
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });

  const { mutate, isPending, error } = mutation;

  async function mutateAsync(
    params: Omit<TParams, 'fetchOptions'> & {
      fetchOptions?: { throw?: true } | undefined;
    },
  ): Promise<ThrowableResult>;

  async function mutateAsync(
    params: Omit<TParams, 'fetchOptions'> & {
      fetchOptions?: BetterFetchOption;
    },
  ): Promise<NonThrowableResult>;

  async function mutateAsync(params: TParams): Promise<ThrowableResult | NonThrowableResult> {
    return await mutation.mutateAsync(params);
  }

  return {
    ...mutation,
    mutate,
    mutateAsync,
    isPending,
    error,
  };
}

type UseAuthQueryProps<TData, TAuthClient> = {
  authClient: TAuthClient;
  queryKey: QueryKey;
  queryFn: BetterFetchRequest<TData>;
  options?: Partial<AnyUseQueryOptions>;
};

export function useAuthQuery<TData, TAuthClient extends AnyAuthClient = AnyAuthClient>({
  authClient,
  queryKey,
  queryFn,
  options,
}: UseAuthQueryProps<TData, TAuthClient>) {
  const { data: sessionData } = useSession(authClient);
  const { queryOptions } = useContext(AuthQueryContext);
  const mergedOptions = { ...queryOptions, ...options };

  return useQuery<TData>({
    queryKey,
    queryFn: sessionData ? () => queryFn({ fetchOptions: { throw: true } }) : skipToken,
    ...mergedOptions,
  });
}

const useOnMutateError = () => {
  const queryClient = useQueryClient();
  const { optimistic } = useContext(AuthQueryContext);

  const onMutateError = (
    error: Error,
    queryKey: QueryKey,
    context?: { previousData?: unknown },
  ) => {
    if (error) {
      console.error(error);
      queryClient
        .getQueryCache()
        .config.onError?.(error, { queryKey } as unknown as Query<unknown, unknown>);
    }

    if (!optimistic || !context?.previousData) return;
    queryClient.setQueryData(queryKey, context.previousData);
  };

  return { onMutateError };
};
