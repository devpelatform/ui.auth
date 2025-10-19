'use client';

import { useMemo } from 'react';
import { FingerprintIcon } from 'lucide-react';

import { Button } from '@pelatform/ui/default';
import { useAuth } from '@/hooks';
import { useOnSuccessTransition } from '@/hooks/private';
import { cn, getLocalizedError } from '@/lib/utils';
import type { AuthButtonProps } from '../types';

export function PasskeyButton({
  classNames,
  isSubmitting,
  localization: localizationProp,
  redirectTo: redirectToProp,
  setIsSubmitting,
}: AuthButtonProps) {
  const { authClient, localization: localizationContext, toast } = useAuth();

  const localization = useMemo(
    () => ({ ...localizationContext, ...localizationProp }),
    [localizationContext, localizationProp],
  );

  const { onSuccess } = useOnSuccessTransition(redirectToProp);

  const signInPassKey = async () => {
    setIsSubmitting?.(true);

    try {
      const response = await authClient.signIn.passkey({
        fetchOptions: { throw: true },
      });

      if (response?.error) {
        toast({
          message: getLocalizedError({
            error: response.error,
            localization,
          }),
        });

        setIsSubmitting?.(false);
      } else {
        onSuccess();
      }
    } catch (error) {
      toast({
        message: getLocalizedError({ error, localization }),
      });

      setIsSubmitting?.(false);
    }
  };

  return (
    <Button
      variant="secondary"
      name="passkey"
      value="true"
      className={cn('w-full', classNames?.form?.button, classNames?.form?.secondaryButton)}
      disabled={isSubmitting}
      onClick={signInPassKey}
      formNoValidate
    >
      <FingerprintIcon />
      {localization.SIGN_IN_WITH} {localization.PASSKEY}
    </Button>
  );
}
