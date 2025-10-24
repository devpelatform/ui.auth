'use client';

import { useContext } from 'react';

import type { AuthQueryOptions } from '../types/query';
import { AuthHooksContext } from './private';

/**
 * Hook to delete an API key.
 *
 * @param options - Optional query options for customizing the mutation behavior
 * @returns Mutation object containing:
 *   - mutate: Function to trigger API key deletion
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
 * import { useDeleteApiKey } from "@pelatform/ui.auth";
 *
 * function ApiKeyItem({ apiKey }) {
 *   const deleteApiKey = useDeleteApiKey({
 *     onSuccess: () => {
 *       console.log('API key deleted successfully');
 *     },
 *     onError: (error) => {
 *       console.error('Failed to delete API key:', error);
 *     }
 *   });
 *
 *   const handleDelete = () => {
 *     if (confirm('Are you sure you want to delete this API key?')) {
 *       deleteApiKey.mutate(apiKey.id);
 *     }
 *   };
 *
 *   return (
 *     <div>
 *       <span>{apiKey.name}</span>
 *       <button
 *         onClick={handleDelete}
 *         disabled={deleteApiKey.isPending}
 *       >
 *         {deleteApiKey.isPending ? 'Deleting...' : 'Delete'}
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */
export const useDeleteApiKey = (options?: Partial<AuthQueryOptions>) => {
  const hooks = useContext(AuthHooksContext);
  if (!hooks) {
    throw new Error('useDeleteApiKey must be used within AuthUIProvider');
  }

  return hooks.useDeleteApiKey(options);
};
