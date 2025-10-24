'use client';

import { useContext } from 'react';

import type { AnyUseQueryOptions, QueryKey } from '@pelatform/ui/re/tanstack-query';
import type { BetterFetchRequest } from '../types/auth';
import { AuthHooksContext } from './private';

/**
 * Hook to create authenticated queries.
 *
 * @template TData - The expected data type returned by the query
 * @param params - Query configuration object
 * @param params.queryKey - Unique key for the query
 * @param params.queryFn - Function that returns the data for this query
 * @param params.options - Optional query options for customizing behavior
 * @returns Query result containing:
 *   - data: The data returned by the query function
 *   - isLoading: Boolean indicating if the query is loading
 *   - isPending: Boolean indicating if the query is pending
 *   - isError: Boolean indicating if there was an error
 *   - error: Error object if the query failed
 *   - refetch: Function to manually refetch the data
 *   - And other standard TanStack Query properties
 *
 * @example
 * ```tsx
 * import { useAuthQuery } from "@pelatform/ui.auth";
 *
 * function UserPosts() {
 *   const { data: posts, isLoading, error } = useAuthQuery({
 *     queryKey: ['user-posts'],
 *     queryFn: ({ fetchOptions }) =>
 *       fetch('/api/user/posts', fetchOptions).then(res => res.json()),
 *     options: {
 *       staleTime: 5 * 60 * 1000, // 5 minutes
 *       retry: 3
 *     }
 *   });
 *
 *   if (isLoading) return <div>Loading posts...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *
 *   return (
 *     <div>
 *       {posts?.map(post => (
 *         <div key={post.id}>{post.title}</div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export const useAuthQuery = <TData>(params: {
  queryKey: QueryKey;
  queryFn: BetterFetchRequest<TData>;
  options?: Partial<AnyUseQueryOptions>;
}) => {
  const hooks = useContext(AuthHooksContext);
  if (!hooks) {
    throw new Error('useAuthQuery must be used within AuthUIProvider');
  }

  return hooks.useAuthQuery<TData>(params);
};
