'use client';

import { useContext } from 'react';

import type { AnyUseQueryOptions } from '@pelatform/ui/re/tanstack-query';
import { AuthHooksContext } from '@/hooks';
import type { AnyAuthClient, AuthClient } from '@/types/auth';

/**
 * Hook to fetch detailed account information.
 *
 * @param params - Parameters for the account info request
 * @param options - Optional query options to customize request behavior
 * @returns Query result containing:
 *   - data: Account information object (e.g., id, email, profile details)
 *   - isLoading: Boolean indicating if the query is loading
 *   - isPending: Boolean indicating if the query is pending
 *   - isError: Boolean indicating if there was an error
 *   - error: Error object if the query failed
 *   - refetch: Function to manually refetch the data
 *   - And other standard TanStack Query properties
 *
 * @example
 * ```tsx
 * import { useAccountInfo } from "@pelatform/ui.auth";
 *
 * function AccountInfoView({ accountId }: { accountId: string }) {
 *   const { data: account, isLoading, error } = useAccountInfo({ accountId }, {
 *     staleTime: 60_000,
 *     retry: 2,
 *   });
 *
 *   if (isLoading) return <div>Loading account info...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *   if (!account) return <div>No account found</div>;
 *
 *   return (
 *     <div>
 *       <h2>{account.email}</h2>
 *       <p>Created: {new Date(account.createdAt).toLocaleDateString()}</p>
 *     </div>
 *   );
 * }
 * ```
 */
export const useAccountInfo = <T extends AnyAuthClient>(
  params: Parameters<AuthClient['accountInfo']>[0],
  options?: Partial<AnyUseQueryOptions>,
) => {
  const hooks = useContext(AuthHooksContext);
  if (!hooks) {
    throw new Error('useAccountInfo must be used within AuthUIProvider');
  }

  return hooks.useAccountInfo<T>(params, options);
};

/**
 * Hook to fetch a list of user accounts.
 *
 * @param options - Optional query options for customizing the request behavior
 * @returns Query result containing:
 *   - data: Array of account objects with user information
 *   - isLoading: Boolean indicating if the query is loading
 *   - isPending: Boolean indicating if the query is pending
 *   - isError: Boolean indicating if there was an error
 *   - error: Error object if the query failed
 *   - refetch: Function to manually refetch the data
 *   - And other standard TanStack Query properties
 *
 * @example
 * ```tsx
 * import { useListAccounts } from "@pelatform/ui.auth";
 *
 * function AccountsList() {
 *   const { data: accounts, isLoading, error } = useListAccounts({
 *     staleTime: 5 * 60 * 1000, // 5 minutes
 *     retry: 3
 *   });
 *
 *   if (isLoading) return <div>Loading accounts...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *
 *   return (
 *     <ul>
 *       {accounts?.map(account => (
 *         <li key={account.id}>{account.email}</li>
 *       ))}
 *     </ul>
 *   );
 * }
 * ```
 */
export const useListAccounts = <T extends AnyAuthClient>(options?: Partial<AnyUseQueryOptions>) => {
  const hooks = useContext(AuthHooksContext);
  if (!hooks) {
    throw new Error('useListAccounts must be used within AuthUIProvider');
  }

  return hooks.useListAccounts<T>(options);
};

/**
 * Hook to unlink a user account.
 *
 * @returns Mutation object containing:
 *   - mutate: Function to trigger the unlink account operation
 *   - mutateAsync: Async version of mutate function
 *   - isPending: Boolean indicating if the mutation is in progress
 *   - isError: Boolean indicating if there was an error
 *   - error: Error object if the mutation failed
 *   - isSuccess: Boolean indicating if the mutation was successful
 *   - data: Response data from successful mutation
 *   - reset: Function to reset the mutation state
 *
 * @example
 * ```tsx
 * import { useUnlinkAccount } from "@pelatform/ui.auth";
 *
 * function AccountSettings() {
 *   const unlinkAccount = useUnlinkAccount();
 *
 *   const handleUnlinkAccount = (accountId: string) => {
 *     unlinkAccount.mutate({ accountId }, {
 *       onSuccess: () => {
 *         console.log('Account unlinked successfully');
 *       },
 *       onError: (error) => {
 *         console.error('Failed to unlink account:', error);
 *       }
 *     });
 *   };
 *
 *   return (
 *     <button
 *       onClick={() => handleUnlinkAccount('account-123')}
 *       disabled={unlinkAccount.isPending}
 *     >
 *       {unlinkAccount.isPending ? 'Unlinking...' : 'Unlink Account'}
 *     </button>
 *   );
 * }
 * ```
 */
export const useUnlinkAccount = <T extends AnyAuthClient>() => {
  const hooks = useContext(AuthHooksContext);
  if (!hooks) {
    throw new Error('useUnlinkAccount must be used within AuthUIProvider');
  }

  return hooks.useUnlinkAccount<T>();
};
