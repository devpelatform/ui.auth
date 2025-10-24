'use client';

import { useContext } from 'react';

import type { AnyAuthClient } from '../types/auth';
import type { AuthQueryOptions } from '../types/query';
import { AuthHooksContext } from './private';

/**
 * Hook to revoke multiple sessions.
 *
 * @param options - Optional query options for customizing the mutation behavior
 * @returns Mutation object containing:
 *   - mutate: Function to trigger sessions revocation
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
 * import { useRevokeSessions } from "@pelatform/ui.auth";
 *
 * function SecuritySettings() {
 *   const revokeSessions = useRevokeSessions({
 *     onSuccess: () => {
 *       console.log('All sessions revoked successfully');
 *       // User will be redirected to login page
 *       window.location.href = '/login';
 *     }
 *   });
 *
 *   const handleRevokeAll = () => {
 *     if (confirm('This will sign you out from ALL devices including this one. Continue?')) {
 *       revokeSessions.mutate({}, {
 *         onError: (error) => {
 *           console.error('Failed to revoke all sessions:', error);
 *         }
 *       });
 *     }
 *   };
 *
 *   return (
 *     <div>
 *       <h3>Emergency Security Action</h3>
 *       <p>Sign out from ALL devices including this one</p>
 *       <button
 *         onClick={handleRevokeAll}
 *         disabled={revokeSessions.isPending}
 *         style={{ backgroundColor: 'red', color: 'white' }}
 *       >
 *         {revokeSessions.isPending ? 'Signing out...' : 'Sign out everywhere'}
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */
export const useRevokeSessions = <T extends AnyAuthClient>(options?: Partial<AuthQueryOptions>) => {
  const hooks = useContext(AuthHooksContext);
  if (!hooks) {
    throw new Error('useRevokeSessions must be used within AuthUIProvider');
  }

  return hooks.useRevokeSessions<T>(options);
};
