'use client';

import { useContext } from 'react';

import type { AnyUseQueryOptions } from '@pelatform/ui/re/tanstack-query';
import type { AnyAuthClient } from '../types/auth';
import { AuthHooksContext } from './private';

/**
 * Hook to get the current user session.
 *
 * @param options - Optional query options for customizing the request behavior
 * @returns Query result containing:
 *   - data: Session object with user and session information
 *   - user: User object with user details (id, name, email, etc.)
 *   - session: Session object with session details
 *   - isLoading: Boolean indicating if the query is loading
 *   - isPending: Boolean indicating if the query is pending
 *   - isError: Boolean indicating if there was an error
 *   - error: Error object if the query failed
 *   - refetch: Function to manually refetch the data
 *   - And other standard TanStack Query properties
 *
 * @example
 * ```tsx
 * import { useSession } from "@pelatform/ui.auth";
 *
 * function UserProfile() {
 *   const { user, session, isPending } = useSession({
 *     refetchOnWindowFocus: false
 *   });
 *
 *   if (isPending) return <div>Loading...</div>;
 *   if (!user) return <div>Not authenticated</div>;
 *
 *   return (
 *     <div>
 *       <h1>Welcome, {user.name}!</h1>
 *       <p>Email: {user.email}</p>
 *       <p>Session ID: {session?.id}</p>
 *     </div>
 *   );
 * }
 * ```
 */
export const useSession = <T extends AnyAuthClient>(options?: Partial<AnyUseQueryOptions>) => {
  const hooks = useContext(AuthHooksContext);
  if (!hooks) {
    throw new Error('useSession must be used within AuthUIProvider');
  }

  return hooks.useSession<T>(options);
};
