'use client';

import { useContext } from 'react';

import type { AnyUseQueryOptions } from '@pelatform/ui/re/tanstack-query';
import type { AnyAuthClient } from '../types/auth';
import { AuthHooksContext } from './private';

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
