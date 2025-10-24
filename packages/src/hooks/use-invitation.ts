'use client';

import { useContext } from 'react';

import type { AnyUseQueryOptions } from '@pelatform/ui/re/tanstack-query';
import type { AuthClient } from '../types/auth';
import { AuthHooksContext } from './private';

/**
 * Hook to get organization invitation details.
 *
 * @param params - Invitation parameters
 * @param options - Optional query options for customizing the request behavior
 * @returns Query result containing:
 *   - data: Invitation object with details
 *   - isLoading: Boolean indicating if the query is loading
 *   - isPending: Boolean indicating if the query is pending
 *   - isError: Boolean indicating if there was an error
 *   - error: Error object if the query failed
 *   - refetch: Function to manually refetch the data
 *   - And other standard TanStack Query properties
 *
 * @example
 * ```tsx
 * import { useInvitation } from "@pelatform/ui.auth";
 * import { useParams } from "react-router-dom";
 *
 * function InvitationPage() {
 *   const { token } = useParams();
 *   const { data: invitation, isLoading, error } = useInvitation({ token });
 *
 *   if (isLoading) return <div>Loading invitation...</div>;
 *   if (error) return <div>Invalid or expired invitation</div>;
 *   if (!invitation) return <div>Invitation not found</div>;
 *
 *   return (
 *     <div>
 *       <h1>Organization Invitation</h1>
 *       <div>
 *         <h2>You're invited to join {invitation.organizationName}</h2>
 *         <p>Invited by: {invitation.inviterName}</p>
 *         <p>Role: {invitation.role}</p>
 *         <p>Expires: {new Date(invitation.expiresAt).toLocaleDateString()}</p>
 *         <button onClick={() => acceptInvitation(invitation.token)}>
 *           Accept Invitation
 *         </button>
 *       </div>
 *     </div>
 *   );
 * }
 * ```
 */
export const useInvitation = (
  params: Parameters<AuthClient['organization']['getInvitation']>[0],
  options?: Partial<AnyUseQueryOptions>,
) => {
  const hooks = useContext(AuthHooksContext);
  if (!hooks) {
    throw new Error('useInvitation must be used within AuthUIProvider');
  }

  return hooks.useInvitation(params, options);
};
