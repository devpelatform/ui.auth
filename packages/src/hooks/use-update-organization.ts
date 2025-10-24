'use client';

import { useContext } from 'react';

import type { AuthQueryOptions } from '../types/query';
import { AuthHooksContext } from './private';

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
