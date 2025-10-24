'use client';

import { useContext } from 'react';

import type { AnyUseQueryOptions } from '@pelatform/ui/re/tanstack-query';
import type { AuthClient } from '../types/auth';
import { AuthHooksContext } from './private';

/**
 * Hook to list members of an organization.
 *
 * @param params - Parameters to filter members (e.g. organizationId, role, pagination)
 * @param options - Optional query options for customizing the request behavior
 * @returns Query result containing:
 *   - data: Array of organization members
 *   - isLoading: Boolean indicating if the query is loading
 *   - isPending: Boolean indicating if the query is pending
 *   - isError: Boolean indicating if there was an error
 *   - error: Error object if the query failed
 *   - refetch: Function to manually refetch the data
 *   - And other standard TanStack Query properties
 *
 * @example
 * ```tsx
 * import { useListMembers } from "@pelatform/ui.auth";
 *
 * function MembersList({ organizationId }: { organizationId: string }) {
 *   const { data: members, isLoading, error } = useListMembers({
 *     organizationId,
 *   });
 *
 *   if (isLoading) return <div>Loading members...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *   if (!members?.length) return <div>No members found</div>;
 *
 *   return (
 *     <ul>
 *       {members.map((m) => (
 *         <li key={m.id}>{m.name} — {m.role}</li>
 *       ))}
 *     </ul>
 *   );
 * }
 * ```
 */
export const useListMembers = (
  params: Parameters<AuthClient['organization']['listMembers']>[0],
  options?: Partial<AnyUseQueryOptions>,
) => {
  const hooks = useContext(AuthHooksContext);
  if (!hooks) {
    throw new Error('useListMembers must be used within AuthUIProvider');
  }

  return hooks.useListMembers(params, options);
};
