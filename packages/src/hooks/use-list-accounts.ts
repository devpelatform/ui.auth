'use client';

import { useContext } from 'react';

import type { AnyUseQueryOptions } from '@pelatform/ui/re/tanstack-query';
import type { AnyAuthClient } from '../types/auth';
import { AuthHooksContext } from './private';

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
