'use client';

import { useContext } from 'react';

import type { AuthQueryOptions } from '../types/query';
import { AuthHooksContext } from './private';

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
