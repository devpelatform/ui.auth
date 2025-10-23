'use client';

import { useContext, useEffect } from 'react';

import type { AuthViewPath } from '../lib/view-paths';
import type { AnyAuthClient } from '../types/auth';
import { AuthUIContext } from './index';
import { useSession } from './main';

interface AuthenticateOptions<TAuthClient extends AnyAuthClient> {
  authClient?: TAuthClient;
  authView?: AuthViewPath;
  enabled?: boolean;
}

export function useAuthenticate<TAuthClient extends AnyAuthClient>(
  options?: AuthenticateOptions<TAuthClient>,
) {
  type Session = TAuthClient['$Infer']['Session']['session'];
  type User = TAuthClient['$Infer']['Session']['user'];

  const { authClient: authClientProp, authView = 'SIGN_IN', enabled = true } = options ?? {};

  const { authClient: authClientContext, basePath, replace, viewPaths } = useContext(AuthUIContext);

  const authClient = authClientProp ?? authClientContext;

  const { data, isPending, error, refetch } = useSession(authClient);
  const sessionData = data as
    | {
        session: Session;
        user: User;
      }
    | null
    | undefined;

  useEffect(() => {
    if (!enabled || isPending || sessionData) return;

    const currentUrl = new URL(window.location.href);
    const redirectTo =
      currentUrl.searchParams.get('redirectTo') ||
      window.location.href.replace(window.location.origin, '');

    replace(`${basePath}/${viewPaths[authView]}?redirectTo=${encodeURIComponent(redirectTo)}`);
  }, [isPending, sessionData, basePath, viewPaths, replace, authView, enabled]);

  return {
    data: sessionData,
    user: sessionData?.user,
    isPending,
    isLoading: isPending,
    error,
    refetch,
  };
}
