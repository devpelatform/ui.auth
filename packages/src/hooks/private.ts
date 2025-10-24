/* @private */

'use client';

import {
  createContext,
  type RefObject,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  useTransition,
} from 'react';
import type HCaptcha from '@hcaptcha/react-hcaptcha';
import type { TurnstileInstance } from '@marsidev/react-turnstile';
import { useGoogleReCaptcha } from '@wojtekmaj/react-recaptcha-v3';
import type ReCAPTCHA from 'react-google-recaptcha';

import type { createAuthHooks } from '../lib/create-auth-hooks';
import type { AuthLocalization } from '../lib/localization/index';
import { getSearchParam } from '../lib/utils';
import { useSession } from './default';
import { AuthUIContext } from './main';

type AuthHooks = ReturnType<typeof createAuthHooks>;
export const AuthHooksContext = createContext<AuthHooks | null>(null);

// Default captcha endpoints
const DEFAULT_CAPTCHA_ENDPOINTS = ['/sign-up/email', '/sign-in/email', '/forget-password'];

// Sanitize action name for reCAPTCHA
// Google reCAPTCHA only allows A-Za-z/_ in action names
const sanitizeActionName = (action: string): string => {
  // First remove leading slash if present
  let result = action.startsWith('/') ? action.substring(1) : action;

  // Convert both kebab-case and path separators to camelCase
  // Example: "/sign-in/email" becomes "signInEmail"
  result = result
    .replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
    .replace(/\/([a-z])/g, (_, letter) => letter.toUpperCase())
    .replace(/\//g, '')
    .replace(/[^A-Za-z0-9_]/g, '');

  return result;
};

export function useCaptcha(localizationProp?: AuthLocalization) {
  const { captcha } = useContext(AuthUIContext);

  const localization = useLocalization(localizationProp);

  // biome-ignore lint/suspicious/noExplicitAny: disable
  const captchaRef = useRef<any>(null);
  const { executeRecaptcha } = useGoogleReCaptcha();

  const executeCaptcha = async (action: string) => {
    if (!captcha) throw new Error(localization.MISSING_RESPONSE);

    // Sanitize the action name for reCAPTCHA
    let response: string | undefined | null;

    switch (captcha.provider) {
      case 'google-recaptcha-v3': {
        const sanitizedAction = sanitizeActionName(action);
        response = await executeRecaptcha?.(sanitizedAction);
        break;
      }

      case 'google-recaptcha-v2-checkbox': {
        const recaptchaRef = captchaRef as RefObject<ReCAPTCHA>;
        response = recaptchaRef.current.getValue();
        break;
      }

      case 'google-recaptcha-v2-invisible': {
        const recaptchaRef = captchaRef as RefObject<ReCAPTCHA>;
        response = await recaptchaRef.current.executeAsync();
        break;
      }

      case 'cloudflare-turnstile': {
        const turnstileRef = captchaRef as RefObject<TurnstileInstance>;
        response = turnstileRef.current.getResponse();
        break;
      }

      case 'hcaptcha': {
        const hcaptchaRef = captchaRef as RefObject<HCaptcha>;
        response = hcaptchaRef.current.getResponse();
        break;
      }
    }

    if (!response) {
      throw new Error(localization.MISSING_RESPONSE);
    }

    return response;
  };

  const getCaptchaHeaders = async (action: string) => {
    if (!captcha) return undefined;

    // Use custom endpoints if provided, otherwise use defaults
    const endpoints = captcha.endpoints || DEFAULT_CAPTCHA_ENDPOINTS;

    // Only execute captcha if the action is in the endpoints list
    if (endpoints.includes(action)) {
      return { 'x-captcha-response': await executeCaptcha(action) };
    }

    return undefined;
  };

  const resetCaptcha = () => {
    if (!captcha) return;

    switch (captcha.provider) {
      case 'google-recaptcha-v3': {
        // No widget to reset; token is generated per execute call
        break;
      }

      case 'google-recaptcha-v2-checkbox':
      case 'google-recaptcha-v2-invisible': {
        const recaptchaRef = captchaRef as RefObject<ReCAPTCHA>;
        recaptchaRef.current?.reset?.();
        break;
      }

      case 'cloudflare-turnstile': {
        const turnstileRef = captchaRef as RefObject<TurnstileInstance>;
        // Some versions expose reset on the instance
        // biome-ignore lint/suspicious/noExplicitAny: disable
        (turnstileRef.current as any)?.reset?.();
        break;
      }

      case 'hcaptcha': {
        const hcaptchaRef = captchaRef as RefObject<HCaptcha>;
        // HCaptcha uses resetCaptcha()
        hcaptchaRef.current?.resetCaptcha?.();
        break;
      }
    }
  };

  return {
    captchaRef,
    getCaptchaHeaders,
    resetCaptcha,
  };
}

function subscribe() {
  return () => {};
}

export function useIsHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}

export function useLang() {
  const [lang, setLang] = useState<string>();

  useEffect(() => {
    const checkLang = () => {
      const currentLang = document.documentElement.getAttribute('lang');
      setLang(currentLang ?? undefined);
    };

    // Initial check
    checkLang();

    // Listen for changes to lang attribute on html tag
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.attributeName === 'lang') {
          checkLang();
        }
      }
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => {
      observer.disconnect();
    };
  }, []);

  return { lang };
}

export function useLocalization(localizationProp?: AuthLocalization) {
  const { localization: localizationContext } = useContext(AuthUIContext);

  const localization = useMemo(
    () => ({ ...localizationContext, ...localizationProp }),
    [localizationContext, localizationProp],
  );

  return localization;
}

export function useOnSuccessTransition(redirectTo?: string) {
  const {
    authClient,
    navigate,
    onSessionChange,
    redirectTo: contextRedirectTo,
  } = useContext(AuthUIContext);

  const { refetch: refetchSession } = useSession(authClient);

  const getRedirectTo = useCallback(
    () => redirectTo || getSearchParam('redirectTo') || contextRedirectTo,
    [redirectTo, contextRedirectTo],
  );

  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!success || isPending) return;

    startTransition(() => {
      navigate(getRedirectTo());
    });
  }, [success, isPending, navigate, getRedirectTo]);

  const onSuccess = useCallback(async () => {
    await refetchSession?.();
    setSuccess(true);

    if (onSessionChange) startTransition(onSessionChange);
  }, [refetchSession, onSessionChange]);

  return { onSuccess, isPending, redirectTo: getRedirectTo() };
}

export function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const checkTheme = () => {
      const isDark =
        document.documentElement.classList.contains('dark') ||
        document.documentElement.getAttribute('style')?.includes('color-scheme: dark');
      setTheme(isDark ? 'dark' : 'light');
    };

    // Initial check
    checkTheme();

    // Listen for changes to html tag
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.attributeName === 'style' || mutation.attributeName === 'class') {
          checkTheme();
        }
      }
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => {
      observer.disconnect();
    };
  }, []);

  return { theme };
}
