import type { AnyUseQueryOptions, QueryClient } from '@pelatform/ui/re/tanstack-query';
import type { AnyAuthClient } from '../types/auth';
import { type AuthQueryOptions, defaultAuthQueryOptions } from '../types/query';
import { prefetchSession } from './prefetch-session';

export function createAuthPrefetches<TAuthClient extends AnyAuthClient>(
  authClient: TAuthClient,
  queryOptions?: AuthQueryOptions,
) {
  return {
    prefetchSession: (queryClient: QueryClient, options?: Partial<AnyUseQueryOptions>) => {
      return prefetchSession(
        authClient,
        queryClient,
        { ...defaultAuthQueryOptions, ...queryOptions },
        options,
      );
    },
  };
}
