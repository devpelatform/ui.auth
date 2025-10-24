'use client';

import { useContext } from 'react';

import type { AnyUseQueryOptions } from '@pelatform/ui/re/tanstack-query';
import { AuthHooksContext } from './private';

/**
 * Hook to fetch a list of passkeys.
 *
 * @param options - Optional query options for customizing the request behavior
 * @returns Query result containing:
 *   - data: Array of passkey objects
 *   - isLoading: Boolean indicating if the query is loading
 *   - isPending: Boolean indicating if the query is pending
 *   - isError: Boolean indicating if there was an error
 *   - error: Error object if the query failed
 *   - refetch: Function to manually refetch the data
 *   - And other standard TanStack Query properties
 *
 * @example
 * ```tsx
 * import { useListPasskeys } from "@pelatform/ui.auth";
 *
 * function PasskeysList() {
 *   const { data: passkeys, isLoading, error } = useListPasskeys({
 *     refetchOnWindowFocus: false
 *   });
 *
 *   if (isLoading) return <div>Loading passkeys...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *   if (!passkeys?.length) return <div>No passkeys found</div>;
 *
 *   return (
 *     <div>
 *       <h2>Your Passkeys</h2>
 *       <p>Passkeys provide secure, passwordless authentication</p>
 *       {passkeys.map(passkey => (
 *         <div key={passkey.id}>
 *           <h3>{passkey.name || 'Unnamed Passkey'}</h3>
 *           <p>Device: {passkey.deviceType}</p>
 *           <p>Created: {new Date(passkey.createdAt).toLocaleDateString()}</p>
 *           <p>Last used: {passkey.lastUsed ? new Date(passkey.lastUsed).toLocaleDateString() : 'Never'}</p>
 *           <p>Authenticator: {passkey.authenticatorName}</p>
 *         </div>
 *       ))}
 *       <button onClick={() => createNewPasskey()}>
 *         Add New Passkey
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */
export const useListPasskeys = (options?: Partial<AnyUseQueryOptions>) => {
  const hooks = useContext(AuthHooksContext);
  if (!hooks) {
    throw new Error('useListPasskeys must be used within AuthUIProvider');
  }

  return hooks.useListPasskeys(options);
};
