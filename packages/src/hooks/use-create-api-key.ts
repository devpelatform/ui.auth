'use client';

import { useContext } from 'react';

import type { AuthQueryOptions } from '../types/query';
import { AuthHooksContext } from './private';

/**
 * Hook to create a new API key.
 *
 * @param options - Optional query options for customizing the mutation behavior
 * @returns Mutation object containing:
 *   - mutate: Function to trigger API key creation
 *   - mutateAsync: Async version of mutate function
 *   - isPending: Boolean indicating if the mutation is in progress
 *   - isError: Boolean indicating if there was an error
 *   - error: Error object if the mutation failed
 *   - isSuccess: Boolean indicating if the mutation was successful
 *   - data: Created API key data
 *   - reset: Function to reset the mutation state
 *
 * @example
 * ```tsx
 * import { useCreateApiKey } from "@pelatform/ui.auth";
 *
 * function CreateApiKeyForm() {
 *   const createApiKey = useCreateApiKey({
 *     onSuccess: (data) => {
 *       console.log('API key created:', data.key);
 *       // Copy to clipboard
 *       navigator.clipboard.writeText(data.key);
 *     },
 *     onError: (error) => {
 *       console.error('Failed to create API key:', error);
 *     }
 *   });
 *
 *   const handleCreateApiKey = (name: string, permissions: string[]) => {
 *     createApiKey.mutate({ name, permissions });
 *   };
 *
 *   return (
 *     <button
 *       onClick={() => handleCreateApiKey('My API Key', ['read', 'write'])}
 *       disabled={createApiKey.isPending}
 *     >
 *       {createApiKey.isPending ? 'Creating...' : 'Create API Key'}
 *     </button>
 *   );
 * }
 * ```
 */
export const useCreateApiKey = (options?: Partial<AuthQueryOptions>) => {
  const hooks = useContext(AuthHooksContext);
  if (!hooks) {
    throw new Error('useCreateApiKey must be used within AuthUIProvider');
  }

  return hooks.useCreateApiKey(options);
};
