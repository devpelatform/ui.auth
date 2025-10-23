'use client';

import { useContext } from 'react';

import type { AnyUseQueryOptions } from '@pelatform/ui/re/tanstack-query';
import type { AuthClient } from '../../types/auth';
import type { AuthQueryOptions } from '../../types/query';
import { AuthHooksContext } from '../index';

/**
 * Hook to get the currently active organization.
 *
 * @param options - Optional query options for customizing the request behavior
 * @returns Query result containing:
 *   - data: Active organization object with details
 *   - isLoading: Boolean indicating if the query is loading
 *   - isPending: Boolean indicating if the query is pending
 *   - isError: Boolean indicating if there was an error
 *   - error: Error object if the query failed
 *   - refetch: Function to manually refetch the data
 *   - And other standard TanStack Query properties
 *
 * @example
 * ```tsx
 * import { useActiveOrganization } from "@pelatform/ui.auth";
 *
 * function OrganizationHeader() {
 *   const { data: organization, isLoading, error } = useActiveOrganization({
 *     refetchOnWindowFocus: false
 *   });
 *
 *   if (isLoading) return <div>Loading organization...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *   if (!organization) return <div>No active organization</div>;
 *
 *   return (
 *     <header>
 *       <div>
 *         <img src={organization.logo} alt={organization.name} />
 *         <h1>{organization.name}</h1>
 *         <p>{organization.description}</p>
 *       </div>
 *       <div>
 *         <span>Members: {organization.memberCount}</span>
 *         <span>Plan: {organization.plan}</span>
 *         <span>Created: {new Date(organization.createdAt).toLocaleDateString()}</span>
 *       </div>
 *     </header>
 *   );
 * }
 * ```
 */
export const useActiveOrganization = (options?: Partial<AnyUseQueryOptions>) => {
  const hooks = useContext(AuthHooksContext);
  if (!hooks) {
    throw new Error('useActiveOrganization must be used within AuthUIProvider');
  }

  return hooks.useActiveOrganization(options);
};

/**
 * Hook to fetch a list of organizations.
 *
 * @param options - Optional query options for customizing the request behavior
 * @returns Query result containing:
 *   - data: Array of organization objects
 *   - isLoading: Boolean indicating if the query is loading
 *   - isPending: Boolean indicating if the query is pending
 *   - isError: Boolean indicating if there was an error
 *   - error: Error object if the query failed
 *   - refetch: Function to manually refetch the data
 *   - And other standard TanStack Query properties
 *
 * @example
 * ```tsx
 * import { useListOrganizations } from "@pelatform/ui.auth";
 *
 * function OrganizationsList() {
 *   const { data: organizations, isLoading, error } = useListOrganizations({
 *     refetchOnWindowFocus: false
 *   });
 *
 *   if (isLoading) return <div>Loading organizations...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *   if (!organizations?.length) return <div>No organizations found</div>;
 *
 *   return (
 *     <div>
 *       <h2>Your Organizations</h2>
 *       {organizations.map(org => (
 *         <div key={org.id}>
 *           <h3>{org.name}</h3>
 *           <p>{org.description}</p>
 *           <p>Role: {org.memberRole}</p>
 *           <p>Members: {org.memberCount}</p>
 *           <p>Plan: {org.plan}</p>
 *           {org.isActive && <span>Active</span>}
 *           <button onClick={() => switchToOrganization(org.id)}>
 *             Switch to this organization
 *           </button>
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export const useListOrganizations = (options?: Partial<AnyUseQueryOptions>) => {
  const hooks = useContext(AuthHooksContext);
  if (!hooks) {
    throw new Error('useListOrganizations must be used within AuthUIProvider');
  }

  return hooks.useListOrganizations(options);
};

/**
 * Hook to update the currently active organization.
 *
 * Performs an optimistic update against the active organization and organizations list keys,
 * so UI reflects changes immediately while the request is in flight.
 *
 * @param options - Optional mutation options to customize behavior (e.g. onSuccess, onError)
 * @returns Mutation object containing:
 *   - mutate: Function to trigger the update operation
 *   - mutateAsync: Async version of the mutate function
 *   - isPending: Boolean indicating if the mutation is in progress
 *   - isError: Boolean indicating if there was an error
 *   - error: Error object if the mutation failed
 *   - isSuccess: Boolean indicating if the mutation was successful
 *   - data: Response data from a successful mutation
 *   - reset: Function to reset the mutation state
 *
 * @example
 * ```tsx
 * import { useUpdateOrganization } from "@pelatform/ui.auth";
 *
 * function OrganizationSettingsForm() {
 *   const updateOrganization = useUpdateOrganization({
 *     onSuccess: () => console.log("Organization updated"),
 *   });
 *
 *   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
 *     e.preventDefault();
 *     const form = e.currentTarget;
 *     const formData = new FormData(form);
 *     updateOrganization.mutate({
 *       id: String(formData.get("id")),
 *       name: String(formData.get("name")),
 *       description: String(formData.get("description")),
 *     });
 *   };
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       <input name="id" placeholder="Organization ID" />
 *       <input name="name" placeholder="Name" />
 *       <input name="description" placeholder="Description" />
 *       <button type="submit" disabled={updateOrganization.isPending}>
 *         {updateOrganization.isPending ? "Saving..." : "Save"}
 *       </button>
 *     </form>
 *   );
 * }
 * ```
 */
export const useUpdateOrganization = (options?: Partial<AuthQueryOptions>) => {
  const hooks = useContext(AuthHooksContext);
  if (!hooks) {
    throw new Error('useUpdateOrganization must be used within AuthUIProvider');
  }

  return hooks.useUpdateOrganization(options);
};

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

/**
 * Hook to list organization invitations.
 *
 * @param params - Parameters to filter invitations (e.g. organizationId, status, pagination)
 * @param options - Optional query options for customizing the request behavior
 * @returns Query result containing:
 *   - data: Array of invitations
 *   - isLoading: Boolean indicating if the query is loading
 *   - isPending: Boolean indicating if the query is pending
 *   - isError: Boolean indicating if there was an error
 *   - error: Error object if the query failed
 *   - refetch: Function to manually refetch the data
 *   - And other standard TanStack Query properties
 *
 * @example
 * ```tsx
 * import { useListInvitations } from "@pelatform/ui.auth";
 *
 * function InvitationsPanel({ organizationId }: { organizationId: string }) {
 *   const { data: invitations, isLoading, error } = useListInvitations({
 *     organizationId,
 *   });
 *
 *   if (isLoading) return <div>Loading invitations...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *   if (!invitations?.length) return <div>No invitations found</div>;
 *
 *   return (
 *     <ul>
 *       {invitations.map((inv) => (
 *         <li key={inv.id}>
 *           <strong>{inv.email}</strong> — Role: {inv.role}
 *         </li>
 *       ))}
 *     </ul>
 *   );
 * }
 * ```
 */
export const useListInvitations = (
  params: Parameters<AuthClient['organization']['listInvitations']>[0],
  options?: Partial<AnyUseQueryOptions>,
) => {
  const hooks = useContext(AuthHooksContext);
  if (!hooks) {
    throw new Error('useListInvitations must be used within AuthUIProvider');
  }

  return hooks.useListInvitations(params, options);
};

/**
 * Hook to list invitations addressed to the authenticated user.
 *
 * @param options - Optional query options to control request behavior (e.g., staleTime, gcTime, refetchOnWindowFocus)
 * @returns Query result containing:
 *   - data: Array of invitations belonging to the current user
 *   - isLoading: Boolean indicating if the query is loading
 *   - isPending: Boolean indicating if the query is pending
 *   - isError: Boolean indicating if there was an error
 *   - error: Error object if the query failed
 *   - refetch: Function to manually refetch the data
 *   - And other standard TanStack Query properties
 *
 * @example
 * ```tsx
 * import { useListUserInvitations } from "@pelatform/ui.auth";
 *
 * function MyInvitations() {
 *   const { data: invitations, isLoading, error } = useListUserInvitations();
 *
 *   if (isLoading) return <div>Loading invitations...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *   if (!invitations?.length) return <div>No invitations found</div>;
 *
 *   return (
 *     <ul>
 *       {invitations.map((inv) => (
 *         <li key={inv.id}>
 *           <strong>{inv.organizationName}</strong> — Role: {inv.role}
 *         </li>
 *       ))}
 *     </ul>
 *   );
 * }
 * ```
 */
export const useListUserInvitations = (options?: Partial<AnyUseQueryOptions>) => {
  const hooks = useContext(AuthHooksContext);
  if (!hooks) {
    throw new Error('useListUserInvitations must be used within AuthUIProvider');
  }

  return hooks.useListUserInvitations(options);
};

/**
 * Hook to list members of an organization.
 *
 * @param params - Parameters to filter members (e.g. organizationId, role, pagination)
 * @param options - Optional query options for customizing the request behavior
 * @returns Query result containing:
 *   - data: Array of organization members
 *   - isLoading: Boolean indicating if the query is loading
 *   - isPending: Boolean indicating if the query is pending
 *   - isError: Boolean indicating if there was an error
 *   - error: Error object if the query failed
 *   - refetch: Function to manually refetch the data
 *   - And other standard TanStack Query properties
 *
 * @example
 * ```tsx
 * import { useListMembers } from "@pelatform/ui.auth";
 *
 * function MembersList({ organizationId }: { organizationId: string }) {
 *   const { data: members, isLoading, error } = useListMembers({
 *     organizationId,
 *   });
 *
 *   if (isLoading) return <div>Loading members...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *   if (!members?.length) return <div>No members found</div>;
 *
 *   return (
 *     <ul>
 *       {members.map((m) => (
 *         <li key={m.id}>{m.name} — {m.role}</li>
 *       ))}
 *     </ul>
 *   );
 * }
 * ```
 */
export const useListMembers = (
  params: Parameters<AuthClient['organization']['listMembers']>[0],
  options?: Partial<AnyUseQueryOptions>,
) => {
  const hooks = useContext(AuthHooksContext);
  if (!hooks) {
    throw new Error('useListMembers must be used within AuthUIProvider');
  }

  return hooks.useListMembers(params, options);
};
