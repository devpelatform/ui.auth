'use client';

import { useContext } from 'react';

import type { AnyUseQueryOptions } from '@pelatform/ui/re/tanstack-query';
import { AuthHooksContext } from '@/hooks';
import type { AuthQueryOptions } from '@/types/query';

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

/**
 * Hook to fetch a list of API keys.
 *
 * @param options - Optional query options for customizing the request behavior
 * @returns Query result containing:
 *   - data: Array of API key objects
 *   - isLoading: Boolean indicating if the query is loading
 *   - isPending: Boolean indicating if the query is pending
 *   - isError: Boolean indicating if there was an error
 *   - error: Error object if the query failed
 *   - refetch: Function to manually refetch the data
 *   - And other standard TanStack Query properties
 *
 * @example
 * ```tsx
 * import { useListApiKeys } from "@pelatform/ui.auth";
 *
 * function ApiKeysList() {
 *   const { data: apiKeys, isLoading, error } = useListApiKeys({
 *     refetchOnWindowFocus: false,
 *     staleTime: 5 * 60 * 1000, // 5 minutes
 *   });
 *
 *   if (isLoading) return <div>Loading API keys...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *   if (!apiKeys?.length) return <div>No API keys found</div>;
 *
 *   return (
 *     <div>
 *       <h2>API Keys</h2>
 *       {apiKeys.map(key => (
 *         <div key={key.id}>
 *           <h3>{key.name}</h3>
 *           <p>Created: {new Date(key.createdAt).toLocaleDateString()}</p>
 *           <p>Permissions: {key.permissions.join(', ')}</p>
 *           <p>Last used: {key.lastUsed ? new Date(key.lastUsed).toLocaleDateString() : 'Never'}</p>
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export const useListApiKeys = (options?: Partial<AnyUseQueryOptions>) => {
  const hooks = useContext(AuthHooksContext);
  if (!hooks) {
    throw new Error('useListApiKeys must be used within AuthUIProvider');
  }

  return hooks.useListApiKeys(options);
};
