'use client';

import { useContext } from 'react';

import type { AnyUseQueryOptions } from '@pelatform/ui/re/tanstack-query';
import { AuthHooksContext } from './private';

/**
 * Hook to fetch a list of device sessions.
 *
 * @param options - Optional query options for customizing the request behavior
 * @returns Query result containing:
 *   - data: Array of device session objects
 *   - isLoading: Boolean indicating if the query is loading
 *   - isPending: Boolean indicating if the query is pending
 *   - isError: Boolean indicating if there was an error
 *   - error: Error object if the query failed
 *   - refetch: Function to manually refetch the data
 *   - And other standard TanStack Query properties
 *
 * @example
 * ```tsx
 * import { useListDeviceSessions } from "@pelatform/ui.auth";
 *
 * function DeviceSessionsList() {
 *   const { data: sessions, isLoading, error } = useListDeviceSessions({
 *     refetchOnWindowFocus: false,
 *     staleTime: 2 * 60 * 1000, // 2 minutes
 *   });
 *
 *   if (isLoading) return <div>Loading device sessions...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *   if (!sessions?.length) return <div>No active sessions found</div>;
 *
 *   return (
 *     <div>
 *       <h2>Active Device Sessions</h2>
 *       {sessions.map(session => (
 *         <div key={session.id}>
 *           <h3>{session.deviceName || 'Unknown Device'}</h3>
 *           <p>IP Address: {session.ipAddress}</p>
 *           <p>Location: {session.location}</p>
 *           <p>Last Active: {new Date(session.lastActive).toLocaleString()}</p>
 *           <p>Browser: {session.userAgent}</p>
 *           {session.isCurrent && <span>Current Session</span>}
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export const useListDeviceSessions = (options?: Partial<AnyUseQueryOptions>) => {
  const hooks = useContext(AuthHooksContext);
  if (!hooks) {
    throw new Error('useListDeviceSessions must be used within AuthUIProvider');
  }

  return hooks.useListDeviceSessions(options);
};
