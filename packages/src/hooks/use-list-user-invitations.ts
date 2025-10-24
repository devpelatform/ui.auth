'use client';

import { useContext } from 'react';

import type { AnyUseQueryOptions } from '@pelatform/ui/re/tanstack-query';
import { AuthHooksContext } from './private';

/**
 * Hook to list invitations addressed to the authenticated user.
 *
 * @param options - Optional query options to control request behavior (e.g., staleTime, gcTime, refetchOnWindowFocus)
 * @returns Query result containing:
 *   - data: Array of invitations belonging to the current user
 *   - isLoading: Boolean indicating if the query is loading
 *   - isPending: Boolean indicating if the query is pending
 *   - isError: Boolean indicating if there was an error
 *   - error: Error object if the query failed
 *   - refetch: Function to manually refetch the data
 *   - And other standard TanStack Query properties
 *
 * @example
 * ```tsx
 * import { useListUserInvitations } from "@pelatform/ui.auth";
 *
 * function MyInvitations() {
 *   const { data: invitations, isLoading, error } = useListUserInvitations();
 *
 *   if (isLoading) return <div>Loading invitations...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *   if (!invitations?.length) return <div>No invitations found</div>;
 *
 *   return (
 *     <ul>
 *       {invitations.map((inv) => (
 *         <li key={inv.id}>
 *           <strong>{inv.organizationName}</strong> — Role: {inv.role}
 *         </li>
 *       ))}
 *     </ul>
 *   );
 * }
 * ```
 */
export const useListUserInvitations = (options?: Partial<AnyUseQueryOptions>) => {
  const hooks = useContext(AuthHooksContext);
  if (!hooks) {
    throw new Error('useListUserInvitations must be used within AuthUIProvider');
  }

  return hooks.useListUserInvitations(options);
};
