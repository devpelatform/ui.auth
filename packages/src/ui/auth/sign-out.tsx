'use client';

import { useEffect, useRef } from 'react';

import { Spinner } from '@pelatform/ui/default';
import { useAuth } from '../../hooks/index';
import { useOnSuccessTransition } from '../../hooks/private';
import type { AuthFormProps } from './types';

export function SignOut({ redirectTo: redirectToProp }: AuthFormProps) {
  const { authClient, basePath, viewPaths } = useAuth();

  const redirectTo = redirectToProp ?? `${basePath}/${viewPaths.SIGN_IN}`;
  const { onSuccess } = useOnSuccessTransition(redirectTo);
  const signingOut = useRef(false);

  useEffect(() => {
    if (signingOut.current) return;
    signingOut.current = true;

    authClient.signOut().finally(onSuccess);
  }, [authClient, onSuccess]);

  return <Spinner />;
}
