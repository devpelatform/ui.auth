'use client';

import { useEffect, useMemo, useRef } from 'react';

import { useAuth } from '@/hooks';
import { useOnSuccessTransition } from '@/hooks/private';
import { getLocalizedError } from '@/lib/utils';
import type { AuthButtonProps } from '../types';

export function OneTap({
  localization: localizationProp,
  redirectTo: redirectToProp,
}: AuthButtonProps) {
  const { authClient, localization: localizationContext, toast } = useAuth();

  const localization = useMemo(
    () => ({ ...localizationContext, ...localizationProp }),
    [localizationContext, localizationProp],
  );

  const { onSuccess } = useOnSuccessTransition(redirectToProp);
  const oneTapFetched = useRef(false);

  useEffect(() => {
    if (oneTapFetched.current) return;
    oneTapFetched.current = true;

    try {
      authClient.oneTap({
        fetchOptions: {
          throw: true,
          onSuccess,
        },
      });
    } catch (error) {
      toast({
        message: getLocalizedError({ error, localization }),
      });
    }
  }, [authClient, localization, onSuccess, toast]);

  return null;
}
