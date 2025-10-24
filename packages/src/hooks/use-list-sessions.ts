'use client';

import { useContext } from 'react';

import type { AnyUseQueryOptions } from '@pelatform/ui/re/tanstack-query';
import type { AnyAuthClient } from '../types/auth';
import { AuthHooksContext } from './private';

/**
 * Hook to fetch a list of user sessions.
 *
 * @param options - Optional query options for customizing the request behavior
 * @returns Query result containing:
 *   - data: Array of session objects
 *   - isLoading: Boolean indicating if the query is loading
 *   - isPending: Boolean indicating if the query is pending
 *   - isError: Boolean indicating if there was an error
 *   - error: Error object if the query failed
 *   - refetch: Function to manually refetch the data
 *   - And other standard TanStack Query properties
 *
 * @example
 * ```tsx
 * import { useListSessions } from "@pelatform/ui.auth";
 *
 * function SessionsList() {
 *   const { data: sessions, isLoading, error } = useListSessions({
 *     refetchOnWindowFocus: false
 *   });
 *
 *   if (isLoading) return <div>Loading sessions...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *   if (!sessions?.length) return <div>No active sessions found</div>;
 *
 *   return (
 *     <div>
 *       <h2>Active Sessions</h2>
 *       {sessions.map(session => (
 *         <div key={session.id}>
 *           <h3>{session.organizationName || 'Personal Session'}</h3>
 *           <p>Created: {new Date(session.createdAt).toLocaleDateString()}</p>
 *           <p>Last Active: {new Date(session.lastActive).toLocaleString()}</p>
 *           <p>IP Address: {session.ipAddress}</p>
 *           <p>User Agent: {session.userAgent}</p>
 *           {session.isCurrent && <span>Current Session</span>}
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export const useListSessions = <T extends AnyAuthClient>(options?: Partial<AnyUseQueryOptions>) => {
  const hooks = useContext(AuthHooksContext);
  if (!hooks) {
    throw new Error('useListSessions must be used within AuthUIProvider');
  }

  return hooks.useListSessions<T>(options);
};
