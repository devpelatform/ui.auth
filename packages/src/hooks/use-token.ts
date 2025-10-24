'use client';

import { useContext } from 'react';

import type { AnyUseQueryOptions } from '@pelatform/ui/re/tanstack-query';
import type { AnyAuthClient } from '../types/auth';
import { AuthHooksContext } from './private';

/**
 * Hook to get the current authentication token.
 *
 * @param options - Optional query options for customizing the request behavior
 * @returns Query result containing:
 *   - data: Token object with token string and metadata
 *   - token: Authentication token string
 *   - payload: Decoded JWT payload with user information
 *   - isLoading: Boolean indicating if the query is loading
 *   - isPending: Boolean indicating if the query is pending
 *   - isError: Boolean indicating if there was an error
 *   - error: Error object if the query failed
 *   - refetch: Function to manually refetch the data
 *   - And other standard TanStack Query properties
 *
 * @example
 * ```tsx
 * import { useToken } from "@pelatform/ui.auth";
 *
 * function TokenInfo() {
 *   const { token, payload, isPending } = useToken({
 *     refetchOnWindowFocus: false
 *   });
 *
 *   if (isPending) return <div>Loading token...</div>;
 *   if (!token) return <div>No token available</div>;
 *
 *   return (
 *     <div>
 *       <p>Token expires: {new Date(payload?.exp * 1000).toLocaleString()}</p>
 *       <p>User ID: {payload?.sub}</p>
 *       <button onClick={() => navigator.clipboard.writeText(token)}>
 *         Copy Token
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */
export const useToken = <T extends AnyAuthClient>(options?: Partial<AnyUseQueryOptions>) => {
  const hooks = useContext(AuthHooksContext);
  if (!hooks) {
    throw new Error('useToken must be used within AuthUIProvider');
  }

  return hooks.useToken<T>(options);
};
