'use client';

import { useContext } from 'react';

import type { AnyUseQueryOptions } from '@pelatform/ui/re/tanstack-query';
import type { AuthQueryOptions } from '../../types/query';
import { AuthHooksContext } from '../index';

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
