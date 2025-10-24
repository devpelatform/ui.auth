'use client';

import { useContext } from 'react';

import type { AnyAuthClient } from '../types/auth';
import type { AuthQueryOptions } from '../types/query';
import { AuthHooksContext } from './private';

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
