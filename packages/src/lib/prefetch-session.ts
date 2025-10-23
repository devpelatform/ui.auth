import type { AnyUseQueryOptions, QueryClient } from '@pelatform/ui/re/tanstack-query';
import type { AnyAuthClient, AuthClient } from '../types/auth';
import type { AuthQueryOptions } from '../types/query';

export async function prefetchSession<TAuthClient extends AnyAuthClient>(
  authClient: TAuthClient,
  queryClient: QueryClient,
  queryOptions?: AuthQueryOptions,
  options?: Partial<AnyUseQueryOptions>,
) {
  const { error, data } = await (authClient as AuthClient).getSession();

  const mergedOptions = {
    ...queryOptions?.queryOptions,
    ...queryOptions?.sessionQueryOptions,
    ...options,
  };

  await queryClient.prefetchQuery({
    ...mergedOptions,
    queryKey: queryOptions?.sessionKey,
    queryFn: () => data as SessionData,
  });

  type SessionData = TAuthClient['$Infer']['Session'];
  type User = TAuthClient['$Infer']['Session']['user'];
  type Session = TAuthClient['$Infer']['Session']['session'];

  return {
    error,
    data: data,
    session: data?.session as Session | undefined,
    user: data?.user as User | undefined,
  };
}
