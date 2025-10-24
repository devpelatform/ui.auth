'use client';

import { useContext } from 'react';

import type { AnyUseQueryOptions } from '@pelatform/ui/re/tanstack-query';
import type { AuthClient } from '../types/auth';
import { AuthHooksContext } from './private';

/**
 * Hook to check if the current user has a specific permission.
 *
 * @param params - Permission parameters to check
 * @param params.permission - The permission string to check
 * @param params.resource - Optional resource identifier
 * @param options - Optional query options for customizing the request behavior
 * @returns Query result containing:
 *   - data: Boolean indicating if user has the permission
 *   - isLoading: Boolean indicating if the query is loading
 *   - isPending: Boolean indicating if the query is pending
 *   - isError: Boolean indicating if there was an error
 *   - error: Error object if the query failed
 *   - refetch: Function to manually refetch the data
 *   - And other standard TanStack Query properties
 *
 * @example
 * ```tsx
 * import { useHasPermission } from "@pelatform/ui.auth";
 *
 * function AdminPanel() {
 *   const { data: canManageUsers, isLoading } = useHasPermission({
 *     permission: 'users:manage'
 *   });
 *
 *   const { data: canEditPost } = useHasPermission({
 *     permission: 'posts:edit',
 *     resource: 'post-123'
 *   });
 *
 *   if (isLoading) return <div>Checking permissions...</div>;
 *
 *   return (
 *     <div>
 *       {canManageUsers && <button>Manage Users</button>}
 *       {canEditPost && <button>Edit Post</button>}
 *     </div>
 *   );
 * }
 * ```
 */
export const useHasPermission = (
  params: Parameters<AuthClient['organization']['hasPermission']>[0],
  options?: Partial<AnyUseQueryOptions>,
) => {
  const hooks = useContext(AuthHooksContext);
  if (!hooks) {
    throw new Error('useHasPermission must be used within AuthUIProvider');
  }

  return hooks.useHasPermission(params, options);
};
