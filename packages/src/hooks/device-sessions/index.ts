'use client';

import { useContext } from 'react';

import type { AnyUseQueryOptions } from '@pelatform/ui/re/tanstack-query';
import type { AuthQueryOptions } from '../../types/query';
import { AuthHooksContext } from '../index';

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

/**
 * Hook to revoke a device session.
 *
 * @param options - Optional query options for customizing the mutation behavior
 * @returns Mutation object containing:
 *   - mutate: Function to trigger device session revocation
 *   - mutateAsync: Async version of mutate function
 *   - isPending: Boolean indicating if the mutation is in progress
 *   - isError: Boolean indicating if there was an error
 *   - error: Error object if the mutation failed
 *   - isSuccess: Boolean indicating if the mutation was successful
 *   - data: Response data from successful revocation
 *   - reset: Function to reset the mutation state
 *
 * @example
 * ```tsx
 * import { useRevokeDeviceSession } from "@pelatform/ui.auth";
 *
 * function DeviceSessionItem({ session }) {
 *   const revokeSession = useRevokeDeviceSession({
 *     onSuccess: () => {
 *       console.log('Session revoked successfully');
 *       // Refresh the sessions list
 *       queryClient.invalidateQueries(['device-sessions']);
 *     },
 *     onError: (error) => {
 *       console.error('Failed to revoke session:', error);
 *     }
 *   });
 *
 *   const handleRevoke = () => {
 *     if (confirm('Are you sure you want to revoke this session?')) {
 *       revokeSession.mutate({ sessionId: session.id });
 *     }
 *   };
 *
 *   return (
 *     <div>
 *       <span>{session.deviceName}</span>
 *       <span>{session.location}</span>
 *       {!session.isCurrent && (
 *         <button
 *           onClick={handleRevoke}
 *           disabled={revokeSession.isPending}
 *         >
 *           {revokeSession.isPending ? 'Revoking...' : 'Revoke'}
 *         </button>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export const useRevokeDeviceSession = (options?: Partial<AuthQueryOptions>) => {
  const hooks = useContext(AuthHooksContext);
  if (!hooks) {
    throw new Error('useRevokeDeviceSession must be used within AuthUIProvider');
  }

  return hooks.useRevokeDeviceSession(options);
};

/**
 * Hook to set the active session.
 *
 * @param options - Optional query options for customizing the mutation behavior
 * @returns Mutation object containing:
 *   - mutate: Function to trigger setting active session
 *   - mutateAsync: Async version of mutate function
 *   - isPending: Boolean indicating if the mutation is in progress
 *   - isError: Boolean indicating if there was an error
 *   - error: Error object if the mutation failed
 *   - isSuccess: Boolean indicating if the mutation was successful
 *   - data: Response data from successful operation
 *   - reset: Function to reset the mutation state
 *
 * @example
 * ```tsx
 * import { useSetActiveSession } from "@pelatform/ui.auth";
 *
 * function SessionSwitcher({ sessions }) {
 *   const setActiveSession = useSetActiveSession({
 *     onSuccess: () => {
 *       console.log('Session switched successfully');
 *       // Optionally redirect or refresh the page
 *       window.location.reload();
 *     },
 *     onError: (error) => {
 *       console.error('Failed to switch session:', error);
 *     }
 *   });
 *
 *   const handleSessionSwitch = (sessionId) => {
 *     setActiveSession.mutate({ sessionId });
 *   };
 *
 *   return (
 *     <div>
 *       <h3>Switch Session</h3>
 *       {sessions.map(session => (
 *         <button
 *           key={session.id}
 *           onClick={() => handleSessionSwitch(session.id)}
 *           disabled={setActiveSession.isPending || session.isCurrent}
 *         >
 *           {session.isCurrent ? 'Current' : 'Switch to'} {session.organizationName}
 *         </button>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export const useSetActiveSession = (options?: Partial<AuthQueryOptions>) => {
  const hooks = useContext(AuthHooksContext);
  if (!hooks) {
    throw new Error('useSetActiveSession must be used within AuthUIProvider');
  }

  return hooks.useSetActiveSession(options);
};
