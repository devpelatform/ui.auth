'use client';

import { useCallback, useMemo } from 'react';

import { AlertToast } from '@pelatform/ui/components';
import { useQueryClient } from '@pelatform/ui/re/tanstack-query';
import { AuthQueryContext, AuthUIContext } from '../../hooks/main';
import { AuthHooksContext } from '../../hooks/private';
import { createAuthHooks } from '../../lib/create-auth-hooks';
import { authLocalization } from '../../lib/localization/index';
import { accountViewPaths, authViewPaths } from '../../lib/view-paths';
import type { AuthClient } from '../../types/auth';
import type { Link, RenderToast } from '../../types/components';
import type { AuthUIProviderProps } from '../../types/main';
import type {
  AccountOptions,
  AvatarOptions,
  CredentialsOptions,
  DeleteUserOptions,
  GenericOAuthOptions,
  SignUpOptions,
  SocialOptions,
} from '../../types/options';
import { defaultAuthQueryOptions } from '../../types/query';
import { RecaptchaV3 } from '../captcha/recaptcha-v3';

const DefaultLink: Link = ({ href, className, children }) => (
  <a className={className} href={href}>
    {children}
  </a>
);

const defaultNavigate = (href: string) => {
  window.location.href = href;
};

const defaultReplace = (href: string) => {
  window.location.replace(href);
};

const defaultToast: RenderToast = ({ message, icon = 'destructive' }) => {
  AlertToast({ message, icon, variant: 'mono' });
};

export const AuthUIProvider = (options: AuthUIProviderProps) => {
  const {
    children,

    // Main
    authClient: authClientProp,
    additionalFields,
    avatar: avatarProp,
    basePath: basePathProp = '/auth',
    baseURL: baseURLProp = '',
    changeEmail = true,
    deleteUser: deleteUserProp,
    displayId = true,
    emailVerification,
    freshAge = 60 * 60 * 24,
    gravatar,
    Link = DefaultLink,
    localization: localizationProp,
    navigate,
    nameRequired = true,
    onSessionChange: onSessionChangeProp,
    persistClient = false,
    redirectTo = '/',
    replace,
    signUp: signUpProp = true,
    toast = defaultToast,
    viewPaths: viewPathsProp,
    apiKey,
    captcha,
    credentials: credentialsProp,
    emailOTP,
    genericOAuth: genericOAuthProp,
    lastLoginMethod,
    magicLink,
    multiSession,
    organization,
    oneTap,
    passkey,
    social: socialProp,
    twoFactor,
    account: accountProp,

    // Query
    sessionQueryOptions,
    tokenQueryOptions,
    ...props
  } = options;

  const authClient = authClientProp as AuthClient;

  const avatar = useMemo<AvatarOptions | undefined>(() => {
    if (!avatarProp) return;

    if (avatarProp === true) {
      return {
        extension: 'png',
        size: 128,
      };
    }

    return {
      upload: avatarProp.upload,
      delete: avatarProp.delete,
      extension: avatarProp.extension || 'png',
      size: avatarProp.size || (avatarProp.upload ? 256 : 128),
    };
  }, [avatarProp]);

  // Remove trailing slash from basePath
  const basePath = basePathProp.endsWith('/') ? basePathProp.slice(0, -1) : basePathProp;

  // Remove trailing slash from baseURL
  const baseURL = baseURLProp.endsWith('/') ? baseURLProp.slice(0, -1) : baseURLProp;

  const deleteUser = useMemo<DeleteUserOptions | undefined>(() => {
    if (!deleteUserProp) return;

    if (deleteUserProp === true) {
      return {};
    }

    return deleteUserProp;
  }, [deleteUserProp]);

  const localization = useMemo(() => {
    return { ...authLocalization, ...localizationProp };
  }, [localizationProp]);

  const signUp = useMemo<SignUpOptions | undefined>(() => {
    if (signUpProp === false) return;

    if (signUpProp === true || signUpProp === undefined) {
      return {
        fields: ['name'],
      };
    }

    return {
      fields: signUpProp.fields || ['name'],
    };
  }, [signUpProp]);

  const viewPaths = useMemo(() => {
    return { ...authViewPaths, ...viewPathsProp };
  }, [viewPathsProp]);

  const credentials = useMemo<CredentialsOptions | undefined>(() => {
    if (credentialsProp === false) return;

    if (credentialsProp === true) {
      return {
        forgotPassword: true,
      };
    }

    return {
      ...credentialsProp,
      forgotPassword: credentialsProp?.forgotPassword ?? true,
    };
  }, [credentialsProp]);

  const genericOAuth = useMemo<GenericOAuthOptions | undefined>(() => {
    if (!genericOAuthProp) return;

    return genericOAuthProp;
  }, [genericOAuthProp]);

  const social = useMemo<SocialOptions | undefined>(() => {
    if (!socialProp) return;

    return socialProp;
  }, [socialProp]);

  const account = useMemo<AccountOptions | undefined>(() => {
    if (accountProp === false) return;

    if (accountProp === true || accountProp === undefined) {
      return {
        basePath: '/account',
        fields: ['image', 'name'],
        viewPaths: accountViewPaths,
      };
    }

    // Remove trailing slash from basePath
    const basePath = accountProp.basePath?.endsWith('/')
      ? accountProp.basePath.slice(0, -1)
      : accountProp.basePath;

    return {
      basePath: basePath ?? '/account',
      fields: accountProp.fields || ['image', 'name'],
      viewPaths: { ...accountViewPaths, ...accountProp.viewPaths },
    };
  }, [accountProp]);

  const authHooks = useMemo(
    () => (authClient ? createAuthHooks<typeof authClient>(authClient) : null),
    [authClient],
  );

  const sessionKey = props.sessionKey || defaultAuthQueryOptions.sessionKey;
  const queryClient = useQueryClient();
  const onSessionChangeCallback = useCallback(async () => {
    await queryClient.refetchQueries({ queryKey: sessionKey });
    queryClient.invalidateQueries({
      predicate: (query) => query.queryKey !== sessionKey,
    });
  }, [queryClient, sessionKey]);

  const onSessionChange = useCallback(async () => {
    await onSessionChangeCallback();
    await onSessionChangeProp?.();
  }, [onSessionChangeCallback, onSessionChangeProp]);

  return (
    <AuthQueryContext.Provider
      value={{
        sessionQueryOptions: {
          staleTime: 60 * 1000,
          ...sessionQueryOptions,
        },
        tokenQueryOptions: {
          staleTime: 600 * 1000,
          ...tokenQueryOptions,
        },
        ...defaultAuthQueryOptions,
        ...props,
      }}
    >
      <AuthHooksContext.Provider value={authHooks}>
        <AuthUIContext.Provider
          value={{
            authClient,
            additionalFields,
            avatar,
            basePath: basePath === '/' ? '' : basePath,
            baseURL,
            changeEmail,
            deleteUser,
            displayId,
            emailVerification,
            freshAge,
            gravatar,
            Link,
            localization,
            navigate: navigate || defaultNavigate,
            nameRequired,
            onSessionChange,
            persistClient,
            redirectTo,
            replace: replace || navigate || defaultReplace,
            signUp,
            toast,
            viewPaths,
            apiKey,
            captcha,
            credentials,
            emailOTP,
            genericOAuth,
            lastLoginMethod,
            magicLink,
            multiSession,
            organization,
            oneTap,
            passkey,
            social,
            twoFactor,
            account,
          }}
        >
          {captcha?.provider === 'google-recaptcha-v3' ? (
            <RecaptchaV3>{children}</RecaptchaV3>
          ) : (
            children
          )}
        </AuthUIContext.Provider>
      </AuthHooksContext.Provider>
    </AuthQueryContext.Provider>
  );
};
