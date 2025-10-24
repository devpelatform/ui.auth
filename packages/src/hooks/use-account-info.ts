'use client';

import { useContext } from 'react';

import type { AnyUseQueryOptions } from '@pelatform/ui/re/tanstack-query';
import type { AnyAuthClient, AuthClient } from '../types/auth';
import { AuthHooksContext } from './private';

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
