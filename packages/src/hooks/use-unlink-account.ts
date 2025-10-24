'use client';

import { useContext } from 'react';

import type { AnyAuthClient } from '../types/auth';
import type { AuthQueryOptions } from '../types/query';
import { AuthHooksContext } from './private';

/**
 * Hook to unlink a user account.
 *
 * @returns Mutation object containing:
 *   - mutate: Function to trigger the unlink account operation
 *   - mutateAsync: Async version of mutate function
 *   - isPending: Boolean indicating if the mutation is in progress
 *   - isError: Boolean indicating if there was an error
 *   - error: Error object if the mutation failed
 *   - isSuccess: Boolean indicating if the mutation was successful
 *   - data: Response data from successful mutation
 *   - reset: Function to reset the mutation state
 *
 * @example
 * ```tsx
 * import { useUnlinkAccount } from "@pelatform/ui.auth";
 *
 * function AccountSettings() {
 *   const unlinkAccount = useUnlinkAccount();
 *
 *   const handleUnlinkAccount = (accountId: string) => {
 *     unlinkAccount.mutate({ accountId }, {
 *       onSuccess: () => {
 *         console.log('Account unlinked successfully');
 *       },
 *       onError: (error) => {
 *         console.error('Failed to unlink account:', error);
 *       }
 *     });
 *   };
 *
 *   return (
 *     <button
 *       onClick={() => handleUnlinkAccount('account-123')}
 *       disabled={unlinkAccount.isPending}
 *     >
 *       {unlinkAccount.isPending ? 'Unlinking...' : 'Unlink Account'}
 *     </button>
 *   );
 * }
 * ```
 */
export const useUnlinkAccount = <T extends AnyAuthClient>(options?: Partial<AuthQueryOptions>) => {
  const hooks = useContext(AuthHooksContext);
  if (!hooks) {
    throw new Error('useUnlinkAccount must be used within AuthUIProvider');
  }

  return hooks.useUnlinkAccount<T>(options);
};
