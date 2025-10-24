'use client';

import { useContext } from 'react';

import type { AnyUseQueryOptions } from '@pelatform/ui/re/tanstack-query';
import type { AuthClient } from '../types/auth';
import { AuthHooksContext } from './private';

/**
 * Hook to list organization invitations.
 *
 * @param params - Parameters to filter invitations (e.g. organizationId, status, pagination)
 * @param options - Optional query options for customizing the request behavior
 * @returns Query result containing:
 *   - data: Array of invitations
 *   - isLoading: Boolean indicating if the query is loading
 *   - isPending: Boolean indicating if the query is pending
 *   - isError: Boolean indicating if there was an error
 *   - error: Error object if the query failed
 *   - refetch: Function to manually refetch the data
 *   - And other standard TanStack Query properties
 *
 * @example
 * ```tsx
 * import { useListInvitations } from "@pelatform/ui.auth";
 *
 * function InvitationsPanel({ organizationId }: { organizationId: string }) {
 *   const { data: invitations, isLoading, error } = useListInvitations({
 *     organizationId,
 *   });
 *
 *   if (isLoading) return <div>Loading invitations...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *   if (!invitations?.length) return <div>No invitations found</div>;
 *
 *   return (
 *     <ul>
 *       {invitations.map((inv) => (
 *         <li key={inv.id}>
 *           <strong>{inv.email}</strong> — Role: {inv.role}
 *         </li>
 *       ))}
 *     </ul>
 *   );
 * }
 * ```
 */
export const useListInvitations = (
  params: Parameters<AuthClient['organization']['listInvitations']>[0],
  options?: Partial<AnyUseQueryOptions>,
) => {
  const hooks = useContext(AuthHooksContext);
  if (!hooks) {
    throw new Error('useListInvitations must be used within AuthUIProvider');
  }

  return hooks.useListInvitations(params, options);
};
