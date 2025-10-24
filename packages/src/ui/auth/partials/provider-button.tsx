'use client';

import { useCallback } from 'react';

import { Button } from '@pelatform/ui/default';
import { useAuth } from '../../../hooks/main';
import { useLocalization, useOnSuccessTransition } from '../../../hooks/private';
import { cn, getLocalizedError } from '../../../lib/utils';
import type { SocialProvider } from '../../../types/auth';
import type { Provider } from '../../../types/components';
import type { AuthButtonProps } from '../types';

export function ProviderButton({
  classNames,
  isSubmitting,
  localization: localizationProp,
  redirectTo: redirectToProp,
  setIsSubmitting,
  className,
  callbackURL: callbackURLProp,
  other,
  provider,
  socialLayout,
}: AuthButtonProps & {
  className?: string;
  callbackURL?: string;
  other?: boolean;
  provider: Provider;
  socialLayout: 'auto' | 'horizontal' | 'grid' | 'vertical';
}) {
  const { authClient, basePath, baseURL, genericOAuth, persistClient, social, toast, viewPaths } =
    useAuth();

  const localization = useLocalization(localizationProp);
  const { redirectTo } = useOnSuccessTransition(redirectToProp);

  const getCallbackURL = useCallback(
    () =>
      `${baseURL}${
        callbackURLProp ||
        (persistClient
          ? `${basePath}/${viewPaths.CALLBACK}?redirectTo=${encodeURIComponent(redirectTo)}`
          : redirectTo)
      }`,
    [callbackURLProp, persistClient, basePath, viewPaths, baseURL, redirectTo],
  );

  const doSignInSocial = async () => {
    setIsSubmitting?.(true);

    try {
      if (other) {
        const oauth2Params = {
          providerId: provider.provider,
          callbackURL: getCallbackURL(),
          fetchOptions: { throw: true },
        };

        if (genericOAuth?.signIn) {
          await genericOAuth.signIn(oauth2Params);

          setTimeout(() => {
            setIsSubmitting?.(false);
          }, 10000);
        } else {
          await authClient.signIn.oauth2(oauth2Params);
        }
      } else {
        const socialParams = {
          provider: provider.provider as SocialProvider,
          callbackURL: getCallbackURL(),
          fetchOptions: { throw: true },
        };

        if (social?.signIn) {
          await social.signIn(socialParams);

          setTimeout(() => {
            setIsSubmitting?.(false);
          }, 10000);
        } else {
          await authClient.signIn.social(socialParams);
        }
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
      variant="outline"
      className={cn(
        socialLayout === 'vertical' ? 'w-full' : 'grow',
        className,
        classNames?.form?.button,
        classNames?.form?.outlineButton,
        classNames?.form?.providerButton,
      )}
      onClick={doSignInSocial}
      disabled={isSubmitting}
    >
      {provider.icon && <provider.icon className={classNames?.form?.icon} />}
      {socialLayout === 'grid' && provider.name}
      {socialLayout === 'vertical' && `${localization.SIGN_IN_WITH} ${provider.name}`}
    </Button>
  );
}
