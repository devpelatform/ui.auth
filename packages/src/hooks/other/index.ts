'use client';

import { useContext } from 'react';

import type { AnyUseQueryOptions, QueryKey } from '@pelatform/ui/re/tanstack-query';
import type { AnyAuthClient } from '../../types/auth';
import { AuthHooksContext } from '../index';
import type { BetterFetchRequest } from '../main';

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

/**
 * Hook for creating authenticated mutations with automatic session handling.
 *
 * @returns Function that creates authenticated mutations
 *
 * @example
 * ```tsx
 * import { useAuthMutation } from "@pelatform/ui.auth";
 *
 * function UpdateProfileForm() {
 *   const authMutation = useAuthMutation();
 *
 *   const updateProfile = authMutation({
 *     queryKey: ['profile'],
 *     mutationFn: async (data) => {
 *       const response = await fetch('/api/profile', {
 *         method: 'PUT',
 *         headers: { 'Content-Type': 'application/json' },
 *         body: JSON.stringify(data)
 *       });
 *       return response.json();
 *     },
 *     options: {
 *       onSuccess: () => {
 *         console.log('Profile updated successfully');
 *       }
 *     }
 *   });
 *
 *   const handleSubmit = (formData) => {
 *     updateProfile.mutate(formData, {
 *       onError: (error) => {
 *         console.error('Update failed:', error);
 *       }
 *     });
 *   };
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       <button
 *         type="submit"
 *         disabled={updateProfile.isPending}
 *       >
 *         {updateProfile.isPending ? 'Updating...' : 'Update Profile'}
 *       </button>
 *     </form>
 *   );
 * }
 * ```
 */
export const useAuthMutation = () => {
  const hooks = useContext(AuthHooksContext);
  if (!hooks) {
    throw new Error('useAuthMutation must be used within AuthUIProvider');
  }

  return hooks.useAuthMutation;
};

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

/**
 * Hook to prefetch session data for improved performance.
 *
 * @param options - Optional query options for customizing the prefetch behavior
 * @returns Prefetch function that can be called to preload session data
 *
 * @example
 * ```tsx
 * import { usePrefetchSession } from "@pelatform/ui.auth";
 * import { useEffect } from "react";
 *
 * function App() {
 *   const prefetchSession = usePrefetchSession({
 *     staleTime: 5 * 60 * 1000 // 5 minutes
 *   });
 *
 *   useEffect(() => {
 *     // Prefetch session data on app initialization
 *     prefetchSession.prefetch();
 *   }, [prefetchSession]);
 *
 *   return (
 *     <div>
 *       <Router>
 *         <Routes>
 *           <Route path="/login" element={<LoginPage />} />
 *           <Route path="/dashboard" element={<Dashboard />} />
 *         </Routes>
 *       </Router>
 *     </div>
 *   );
 * }
 *
 * // Or use it in a navigation component
 * function Navigation() {
 *   const prefetchSession = usePrefetchSession();
 *
 *   const handleDashboardHover = () => {
 *     // Prefetch session data when user hovers over dashboard link
 *     prefetchSession.prefetch();
 *   };
 *
 *   return (
 *     <nav>
 *       <Link
 *         to="/dashboard"
 *         onMouseEnter={handleDashboardHover}
 *       >
 *         Dashboard
 *       </Link>
 *     </nav>
 *   );
 * }
 * ```
 */
export const usePrefetchSession = <T extends AnyAuthClient>(
  options?: Partial<AnyUseQueryOptions>,
) => {
  const hooks = useContext(AuthHooksContext);
  if (!hooks) {
    throw new Error('usePrefetchSession must be used within AuthUIProvider');
  }

  return hooks.usePrefetchSession<T>(options);
};
