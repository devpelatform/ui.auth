'use client';

import { useContext } from 'react';

import type { AnyUseQueryOptions } from '@pelatform/ui/re/tanstack-query';
import { AuthHooksContext } from './private';

/**
 * Hook to get the currently active organization.
 *
 * @param options - Optional query options for customizing the request behavior
 * @returns Query result containing:
 *   - data: Active organization object with details
 *   - isLoading: Boolean indicating if the query is loading
 *   - isPending: Boolean indicating if the query is pending
 *   - isError: Boolean indicating if there was an error
 *   - error: Error object if the query failed
 *   - refetch: Function to manually refetch the data
 *   - And other standard TanStack Query properties
 *
 * @example
 * ```tsx
 * import { useActiveOrganization } from "@pelatform/ui.auth";
 *
 * function OrganizationHeader() {
 *   const { data: organization, isLoading, error } = useActiveOrganization({
 *     refetchOnWindowFocus: false
 *   });
 *
 *   if (isLoading) return <div>Loading organization...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *   if (!organization) return <div>No active organization</div>;
 *
 *   return (
 *     <header>
 *       <div>
 *         <img src={organization.logo} alt={organization.name} />
 *         <h1>{organization.name}</h1>
 *         <p>{organization.description}</p>
 *       </div>
 *       <div>
 *         <span>Members: {organization.memberCount}</span>
 *         <span>Plan: {organization.plan}</span>
 *         <span>Created: {new Date(organization.createdAt).toLocaleDateString()}</span>
 *       </div>
 *     </header>
 *   );
 * }
 * ```
 */
export const useActiveOrganization = (options?: Partial<AnyUseQueryOptions>) => {
  const hooks = useContext(AuthHooksContext);
  if (!hooks) {
    throw new Error('useActiveOrganization must be used within AuthUIProvider');
  }

  return hooks.useActiveOrganization(options);
};
