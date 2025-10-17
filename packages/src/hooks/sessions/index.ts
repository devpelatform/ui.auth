'use client';

import { useContext } from 'react';

import type { AnyUseQueryOptions } from '@pelatform/ui/re/tanstack-query';
import { AuthHooksContext } from '@/hooks';
import type { AnyAuthClient } from '@/types/auth';
import type { AuthQueryOptions } from '@/types/query';

/**
 * Hook to fetch a list of user sessions.
 *
 * @param options - Optional query options for customizing the request behavior
 * @returns Query result containing:
 *   - data: Array of session objects
 *   - isLoading: Boolean indicating if the query is loading
 *   - isPending: Boolean indicating if the query is pending
 *   - isError: Boolean indicating if there was an error
 *   - error: Error object if the query failed
 *   - refetch: Function to manually refetch the data
 *   - And other standard TanStack Query properties
 *
 * @example
 * ```tsx
 * import { useListSessions } from "@pelatform/ui.auth";
 *
 * function SessionsList() {
 *   const { data: sessions, isLoading, error } = useListSessions({
 *     refetchOnWindowFocus: false
 *   });
 *
 *   if (isLoading) return <div>Loading sessions...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *   if (!sessions?.length) return <div>No active sessions found</div>;
 *
 *   return (
 *     <div>
 *       <h2>Active Sessions</h2>
 *       {sessions.map(session => (
 *         <div key={session.id}>
 *           <h3>{session.organizationName || 'Personal Session'}</h3>
 *           <p>Created: {new Date(session.createdAt).toLocaleDateString()}</p>
 *           <p>Last Active: {new Date(session.lastActive).toLocaleString()}</p>
 *           <p>IP Address: {session.ipAddress}</p>
 *           <p>User Agent: {session.userAgent}</p>
 *           {session.isCurrent && <span>Current Session</span>}
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export const useListSessions = <T extends AnyAuthClient>(options?: Partial<AnyUseQueryOptions>) => {
  const hooks = useContext(AuthHooksContext);
  if (!hooks) {
    throw new Error('useListSessions must be used within AuthUIProvider');
  }

  return hooks.useListSessions<T>(options);
};

/**
 * Hook to revoke all other sessions except the current one.
 *
 * @param options - Optional query options for customizing the mutation behavior
 * @returns Mutation object containing:
 *   - mutate: Function to trigger revocation of other sessions
 *   - mutateAsync: Async version of mutate function
 *   - isPending: Boolean indicating if the mutation is in progress
 *   - isError: Boolean indicating if there was an error
 *   - error: Error object if the mutation failed
 *   - isSuccess: Boolean indicating if the mutation was successful
 *   - data: Response data from successful revocation
 *   - reset: Function to reset the mutation state
 *
 * @example
 * ```tsx
 * import { useRevokeOtherSessions } from "@pelatform/ui.auth";
 *
 * function SecuritySettings() {
 *   const revokeOtherSessions = useRevokeOtherSessions({
 *     onSuccess: () => {
 *       console.log('All other sessions revoked successfully');
 *     }
 *   });
 *
 *   const handleRevokeOthers = () => {
 *     if (confirm('This will sign out all other devices. Continue?')) {
 *       revokeOtherSessions.mutate({}, {
 *         onError: (error) => {
 *           console.error('Failed to revoke other sessions:', error);
 *         }
 *       });
 *     }
 *   };
 *
 *   return (
 *     <div>
 *       <h3>Security Actions</h3>
 *       <p>Sign out from all other devices and browsers</p>
 *       <button
 *         onClick={handleRevokeOthers}
 *         disabled={revokeOtherSessions.isPending}
 *       >
 *         {revokeOtherSessions.isPending ? 'Signing out...' : 'Sign out other sessions'}
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */
export const useRevokeOtherSessions = <T extends AnyAuthClient>(
  options?: Partial<AuthQueryOptions>,
) => {
  const hooks = useContext(AuthHooksContext);
  if (!hooks) {
    throw new Error('useRevokeOtherSessions must be used within AuthUIProvider');
  }

  return hooks.useRevokeOtherSessions<T>(options);
};

/**
 * Hook to revoke a specific session.
 *
 * @param options - Optional query options for customizing the mutation behavior
 * @returns Mutation object containing:
 *   - mutate: Function to trigger session revocation
 *   - mutateAsync: Async version of mutate function
 *   - isPending: Boolean indicating if the mutation is in progress
 *   - isError: Boolean indicating if there was an error
 *   - error: Error object if the mutation failed
 *   - isSuccess: Boolean indicating if the mutation was successful
 *   - data: Response data from successful revocation
 *   - reset: Function to reset the mutation state
 *
 * @example
 * ```tsx
 * import { useRevokeSession } from "@pelatform/ui.auth";
 *
 * function SessionItem({ session }) {
 *   const revokeSession = useRevokeSession({
 *     onSuccess: () => {
 *       console.log('Session revoked successfully');
 *     }
 *   });
 *
 *   const handleRevoke = () => {
 *     if (confirm('Are you sure you want to revoke this session?')) {
 *       revokeSession.mutate({ sessionId: session.id }, {
 *         onError: (error) => {
 *           console.error('Failed to revoke session:', error);
 *         }
 *       });
 *     }
 *   };
 *
 *   return (
 *     <div>
 *       <span>{session.organizationName}</span>
 *       <span>{session.ipAddress}</span>
 *       {!session.isCurrent && (
 *         <button
 *           onClick={handleRevoke}
 *           disabled={revokeSession.isPending}
 *         >
 *           {revokeSession.isPending ? 'Revoking...' : 'Revoke'}
 *         </button>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export const useRevokeSession = <T extends AnyAuthClient>(options?: Partial<AuthQueryOptions>) => {
  const hooks = useContext(AuthHooksContext);
  if (!hooks) {
    throw new Error('useRevokeSession must be used within AuthUIProvider');
  }

  return hooks.useRevokeSession<T>(options);
};

/**
 * Hook to revoke multiple sessions.
 *
 * @param options - Optional query options for customizing the mutation behavior
 * @returns Mutation object containing:
 *   - mutate: Function to trigger sessions revocation
 *   - mutateAsync: Async version of mutate function
 *   - isPending: Boolean indicating if the mutation is in progress
 *   - isError: Boolean indicating if there was an error
 *   - error: Error object if the mutation failed
 *   - isSuccess: Boolean indicating if the mutation was successful
 *   - data: Response data from successful revocation
 *   - reset: Function to reset the mutation state
 *
 * @example
 * ```tsx
 * import { useRevokeSessions } from "@pelatform/ui.auth";
 *
 * function SecuritySettings() {
 *   const revokeSessions = useRevokeSessions({
 *     onSuccess: () => {
 *       console.log('All sessions revoked successfully');
 *       // User will be redirected to login page
 *       window.location.href = '/login';
 *     }
 *   });
 *
 *   const handleRevokeAll = () => {
 *     if (confirm('This will sign you out from ALL devices including this one. Continue?')) {
 *       revokeSessions.mutate({}, {
 *         onError: (error) => {
 *           console.error('Failed to revoke all sessions:', error);
 *         }
 *       });
 *     }
 *   };
 *
 *   return (
 *     <div>
 *       <h3>Emergency Security Action</h3>
 *       <p>Sign out from ALL devices including this one</p>
 *       <button
 *         onClick={handleRevokeAll}
 *         disabled={revokeSessions.isPending}
 *         style={{ backgroundColor: 'red', color: 'white' }}
 *       >
 *         {revokeSessions.isPending ? 'Signing out...' : 'Sign out everywhere'}
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */
export const useRevokeSessions = <T extends AnyAuthClient>(options?: Partial<AuthQueryOptions>) => {
  const hooks = useContext(AuthHooksContext);
  if (!hooks) {
    throw new Error('useRevokeSessions must be used within AuthUIProvider');
  }

  return hooks.useRevokeSessions<T>(options);
};

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

/**
 * Hook to update user information.
 *
 * @param options - Optional query options for customizing the mutation behavior
 * @returns Mutation object containing:
 *   - mutate: Function to trigger user update
 *   - mutateAsync: Async version of mutate function
 *   - isPending: Boolean indicating if the mutation is in progress
 *   - isError: Boolean indicating if there was an error
 *   - error: Error object if the mutation failed
 *   - isSuccess: Boolean indicating if the mutation was successful
 *   - data: Updated user data
 *   - reset: Function to reset the mutation state
 *
 * @example
 * ```tsx
 * import { useUpdateUser } from "@pelatform/ui.auth";
 *
 * function UpdateProfileForm() {
 *   const updateUser = useUpdateUser({
 *     onSuccess: (data) => {
 *       console.log('User updated:', data);
 *     }
 *   });
 *
 *   const handleSubmit = (formData) => {
 *     updateUser.mutate({
 *       name: formData.name,
 *       email: formData.email
 *     }, {
 *       onError: (error) => {
 *         console.error('Update failed:', error);
 *       }
 *     });
 *   };
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       <button type="submit" disabled={updateUser.isPending}>
 *         {updateUser.isPending ? 'Updating...' : 'Update Profile'}
 *       </button>
 *     </form>
 *   );
 * }
 * ```
 */
export const useUpdateUser = <T extends AnyAuthClient>(options?: Partial<AuthQueryOptions>) => {
  const hooks = useContext(AuthHooksContext);
  if (!hooks) {
    throw new Error('useUpdateUser must be used within AuthUIProvider');
  }

  return hooks.useUpdateUser<T>(options);
};
