'use client';

import { useEffect, useRef } from 'react';

import { useAuth } from '../../../hooks/main';
import { useLocalization, useOnSuccessTransition } from '../../../hooks/private';
import { getLocalizedError } from '../../../lib/utils';
import type { AuthButtonProps } from '../types';

export function OneTap({
  localization: localizationProp,
  redirectTo: redirectToProp,
}: AuthButtonProps) {
  const { authClient, toast } = useAuth();

  const localization = useLocalization(localizationProp);
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
