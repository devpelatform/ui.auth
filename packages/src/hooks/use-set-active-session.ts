'use client';

import { useContext } from 'react';

import type { AuthQueryOptions } from '../types/query';
import { AuthHooksContext } from './private';

/**
 * Hook to set the active session.
 *
 * @param options - Optional query options for customizing the mutation behavior
 * @returns Mutation object containing:
 *   - mutate: Function to trigger setting active session
 *   - mutateAsync: Async version of mutate function
 *   - isPending: Boolean indicating if the mutation is in progress
 *   - isError: Boolean indicating if there was an error
 *   - error: Error object if the mutation failed
 *   - isSuccess: Boolean indicating if the mutation was successful
 *   - data: Response data from successful operation
 *   - reset: Function to reset the mutation state
 *
 * @example
 * ```tsx
 * import { useSetActiveSession } from "@pelatform/ui.auth";
 *
 * function SessionSwitcher({ sessions }) {
 *   const setActiveSession = useSetActiveSession({
 *     onSuccess: () => {
 *       console.log('Session switched successfully');
 *       // Optionally redirect or refresh the page
 *       window.location.reload();
 *     },
 *     onError: (error) => {
 *       console.error('Failed to switch session:', error);
 *     }
 *   });
 *
 *   const handleSessionSwitch = (sessionId) => {
 *     setActiveSession.mutate({ sessionId });
 *   };
 *
 *   return (
 *     <div>
 *       <h3>Switch Session</h3>
 *       {sessions.map(session => (
 *         <button
 *           key={session.id}
 *           onClick={() => handleSessionSwitch(session.id)}
 *           disabled={setActiveSession.isPending || session.isCurrent}
 *         >
 *           {session.isCurrent ? 'Current' : 'Switch to'} {session.organizationName}
 *         </button>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export const useSetActiveSession = (options?: Partial<AuthQueryOptions>) => {
  const hooks = useContext(AuthHooksContext);
  if (!hooks) {
    throw new Error('useSetActiveSession must be used within AuthUIProvider');
  }

  return hooks.useSetActiveSession(options);
};
