'use client';

import { useContext } from 'react';

import type { AnyAuthClient } from '../types/auth';
import type { AuthQueryOptions } from '../types/query';
import { AuthHooksContext } from './private';

/**
 * Hook to revoke a specific session.
 *
 * @param options - Optional query options for customizing the mutation behavior
 * @returns Mutation object containing:
 *   - mutate: Function to trigger session revocation
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
 * import { useRevokeSession } from "@pelatform/ui.auth";
 *
 * function SessionItem({ session }) {
 *   const revokeSession = useRevokeSession({
 *     onSuccess: () => {
 *       console.log('Session revoked successfully');
 *     }
 *   });
 *
 *   const handleRevoke = () => {
 *     if (confirm('Are you sure you want to revoke this session?')) {
 *       revokeSession.mutate({ sessionId: session.id }, {
 *         onError: (error) => {
 *           console.error('Failed to revoke session:', error);
 *         }
 *       });
 *     }
 *   };
 *
 *   return (
 *     <div>
 *       <span>{session.organizationName}</span>
 *       <span>{session.ipAddress}</span>
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
export const useRevokeSession = <T extends AnyAuthClient>(options?: Partial<AuthQueryOptions>) => {
  const hooks = useContext(AuthHooksContext);
  if (!hooks) {
    throw new Error('useRevokeSession must be used within AuthUIProvider');
  }

  return hooks.useRevokeSession<T>(options);
};
