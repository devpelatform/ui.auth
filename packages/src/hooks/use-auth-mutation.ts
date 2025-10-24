'use client';

import { useContext } from 'react';

import { AuthHooksContext } from './private';

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
