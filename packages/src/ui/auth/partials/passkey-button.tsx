'use client';

import { FingerprintIcon } from 'lucide-react';

import { Button } from '@pelatform/ui/default';
import { useAuth } from '../../../hooks/index';
import { useLocalization, useOnSuccessTransition } from '../../../hooks/private';
import { cn, getLocalizedError } from '../../../lib/utils';
import type { AuthButtonProps } from '../types';

export function PasskeyButton({
  classNames,
  isSubmitting,
  localization: localizationProp,
  redirectTo: redirectToProp,
  setIsSubmitting,
}: AuthButtonProps) {
  const { authClient, toast } = useAuth();

  const localization = useLocalization(localizationProp);
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
      type="button"
      variant="secondary"
      name="passkey"
      value="true"
      className={cn('w-full', classNames?.form?.button, classNames?.form?.secondaryButton)}
      onClick={signInPassKey}
      disabled={isSubmitting}
      formNoValidate
    >
      <FingerprintIcon />
      {localization.SIGN_IN_WITH} {localization.PASSKEY}
    </Button>
  );
}
