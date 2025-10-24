'use client';

import { useContext } from 'react';

import type { AuthQueryOptions } from '../types/query';
import { AuthHooksContext } from './private';

/**
 * Hook to delete a passkey.
 *
 * @param options - Optional query options for customizing the mutation behavior
 * @returns Mutation object containing:
 *   - mutate: Function to trigger passkey deletion
 *   - mutateAsync: Async version of mutate function
 *   - isPending: Boolean indicating if the mutation is in progress
 *   - isError: Boolean indicating if there was an error
 *   - error: Error object if the mutation failed
 *   - isSuccess: Boolean indicating if the mutation was successful
 *   - data: Response data from successful deletion
 *   - reset: Function to reset the mutation state
 *
 * @example
 * ```tsx
 * import { useDeletePasskey } from "@pelatform/ui.auth";
 *
 * function PasskeyItem({ passkey }) {
 *   const deletePasskey = useDeletePasskey({
 *     onSuccess: () => {
 *       console.log('Passkey deleted successfully');
 *     }
 *   });
 *
 *   const handleDelete = () => {
 *     if (confirm('Are you sure you want to delete this passkey?')) {
 *       deletePasskey.mutate({ passkeyId: passkey.id }, {
 *         onError: (error) => {
 *           console.error('Failed to delete passkey:', error);
 *         }
 *       });
 *     }
 *   };
 *
 *   return (
 *     <div>
 *       <span>{passkey.name || 'Unnamed Passkey'}</span>
 *       <span>Created: {new Date(passkey.createdAt).toLocaleDateString()}</span>
 *       <span>Last used: {passkey.lastUsed ? new Date(passkey.lastUsed).toLocaleDateString() : 'Never'}</span>
 *       <button
 *         onClick={handleDelete}
 *         disabled={deletePasskey.isPending}
 *       >
 *         {deletePasskey.isPending ? 'Deleting...' : 'Delete'}
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */
export const useDeletePasskey = (options?: Partial<AuthQueryOptions>) => {
  const hooks = useContext(AuthHooksContext);
  if (!hooks) {
    throw new Error('useDeletePasskey must be used within AuthUIProvider');
  }

  return hooks.useDeletePasskey(options);
};
