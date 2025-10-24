'use client';

import { useContext } from 'react';

import type { AnyUseQueryOptions } from '@pelatform/ui/re/tanstack-query';
import { AuthHooksContext } from './private';

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
