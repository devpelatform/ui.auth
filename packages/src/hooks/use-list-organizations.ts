'use client';

import { useContext } from 'react';

import type { AnyUseQueryOptions } from '@pelatform/ui/re/tanstack-query';
import { AuthHooksContext } from './private';

/**
 * Hook to fetch a list of organizations.
 *
 * @param options - Optional query options for customizing the request behavior
 * @returns Query result containing:
 *   - data: Array of organization objects
 *   - isLoading: Boolean indicating if the query is loading
 *   - isPending: Boolean indicating if the query is pending
 *   - isError: Boolean indicating if there was an error
 *   - error: Error object if the query failed
 *   - refetch: Function to manually refetch the data
 *   - And other standard TanStack Query properties
 *
 * @example
 * ```tsx
 * import { useListOrganizations } from "@pelatform/ui.auth";
 *
 * function OrganizationsList() {
 *   const { data: organizations, isLoading, error } = useListOrganizations({
 *     refetchOnWindowFocus: false
 *   });
 *
 *   if (isLoading) return <div>Loading organizations...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *   if (!organizations?.length) return <div>No organizations found</div>;
 *
 *   return (
 *     <div>
 *       <h2>Your Organizations</h2>
 *       {organizations.map(org => (
 *         <div key={org.id}>
 *           <h3>{org.name}</h3>
 *           <p>{org.description}</p>
 *           <p>Role: {org.memberRole}</p>
 *           <p>Members: {org.memberCount}</p>
 *           <p>Plan: {org.plan}</p>
 *           {org.isActive && <span>Active</span>}
 *           <button onClick={() => switchToOrganization(org.id)}>
 *             Switch to this organization
 *           </button>
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export const useListOrganizations = (options?: Partial<AnyUseQueryOptions>) => {
  const hooks = useContext(AuthHooksContext);
  if (!hooks) {
    throw new Error('useListOrganizations must be used within AuthUIProvider');
  }

  return hooks.useListOrganizations(options);
};
