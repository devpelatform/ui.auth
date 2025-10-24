'use client';

import { useContext } from 'react';

import type { AnyAuthClient } from '../types/auth';
import type { AuthQueryOptions } from '../types/query';
import { AuthHooksContext } from './private';

/**
 * Hook to revoke all other sessions except the current one.
 *
 * @param options - Optional query options for customizing the mutation behavior
 * @returns Mutation object containing:
 *   - mutate: Function to trigger revocation of other sessions
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
 * import { useRevokeOtherSessions } from "@pelatform/ui.auth";
 *
 * function SecuritySettings() {
 *   const revokeOtherSessions = useRevokeOtherSessions({
 *     onSuccess: () => {
 *       console.log('All other sessions revoked successfully');
 *     }
 *   });
 *
 *   const handleRevokeOthers = () => {
 *     if (confirm('This will sign out all other devices. Continue?')) {
 *       revokeOtherSessions.mutate({}, {
 *         onError: (error) => {
 *           console.error('Failed to revoke other sessions:', error);
 *         }
 *       });
 *     }
 *   };
 *
 *   return (
 *     <div>
 *       <h3>Security Actions</h3>
 *       <p>Sign out from all other devices and browsers</p>
 *       <button
 *         onClick={handleRevokeOthers}
 *         disabled={revokeOtherSessions.isPending}
 *       >
 *         {revokeOtherSessions.isPending ? 'Signing out...' : 'Sign out other sessions'}
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */
export const useRevokeOtherSessions = <T extends AnyAuthClient>(
  options?: Partial<AuthQueryOptions>,
) => {
  const hooks = useContext(AuthHooksContext);
  if (!hooks) {
    throw new Error('useRevokeOtherSessions must be used within AuthUIProvider');
  }

  return hooks.useRevokeOtherSessions<T>(options);
};
