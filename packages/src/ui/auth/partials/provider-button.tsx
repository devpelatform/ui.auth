'use client';

import { useCallback, useMemo } from 'react';
import type { SocialProvider } from 'better-auth/social-providers';

import { Button } from '@pelatform/ui/default';
import { useAuth } from '@/hooks';
import { cn, getLocalizedError, getSearchParam } from '@/lib/utils';
import type { Provider } from '@/types/components';
import type { AuthButtonProps } from '../types';

export interface ProviderButtonProps extends AuthButtonProps {
  className?: string;
  callbackURL?: string;
  other?: boolean;
  provider: Provider;
  socialLayout: 'auto' | 'horizontal' | 'grid' | 'vertical';
}

export function ProviderButton({
  className,
  classNames,
  callbackURL: propCallbackURL,
  isSubmitting,
  localization: propLocalization,
  other,
  provider,
  redirectTo: propRedirectTo,
  socialLayout,
  setIsSubmitting,
}: ProviderButtonProps) {
  const {
    authClient,
    basePath,
    baseURL,
    genericOAuth,
    localization: contextLocalization,
    persistClient,
    redirectTo: contextRedirectTo,
    social,
    toast,
    viewPaths,
  } = useAuth();

  const localization = useMemo(
    () => ({ ...contextLocalization, ...propLocalization }),
    [contextLocalization, propLocalization],
  );

  const getRedirectTo = useCallback(
    () => propRedirectTo || getSearchParam('redirectTo') || contextRedirectTo,
    [propRedirectTo, contextRedirectTo],
  );

  const getCallbackURL = useCallback(
    () =>
      `${baseURL}${
        propCallbackURL ||
        (persistClient
          ? `${basePath}/${viewPaths.CALLBACK}?redirectTo=${encodeURIComponent(getRedirectTo())}`
          : getRedirectTo())
      }`,
    [propCallbackURL, persistClient, basePath, viewPaths, baseURL, getRedirectTo],
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
      variant="outline"
      className={cn(
        socialLayout === 'vertical' ? 'w-full' : 'grow',
        className,
        classNames?.form?.button,
        classNames?.form?.outlineButton,
        classNames?.form?.providerButton,
      )}
      disabled={isSubmitting}
      onClick={doSignInSocial}
    >
      {provider.icon && <provider.icon className={classNames?.form?.icon} />}
      {socialLayout === 'grid' && provider.name}
      {socialLayout === 'vertical' && `${localization.SIGN_IN_WITH} ${provider.name}`}
    </Button>
  );
}
