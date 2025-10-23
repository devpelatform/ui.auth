'use client';

import { useEffect, useRef } from 'react';

import { Spinner } from '@pelatform/ui/default';
import { useAuth } from '../../hooks/index';
import { useOnSuccessTransition } from '../../hooks/private';
import type { AuthFormProps } from './types';

export function AuthCallback({ redirectTo: redirectToProp }: AuthFormProps) {
  const { persistClient } = useAuth();

  const { onSuccess } = useOnSuccessTransition(redirectToProp);
  const isRedirecting = useRef(false);

  useEffect(() => {
    if (isRedirecting.current) return;

    if (!persistClient) {
      isRedirecting.current = true;
      onSuccess();
      return;
    }

    isRedirecting.current = true;
    onSuccess();
  }, [persistClient, onSuccess]);

  return <Spinner />;
}
