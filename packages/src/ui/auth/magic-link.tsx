'use client';

import { useCallback, useEffect, useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import type { BetterFetchOption } from 'better-auth/react';

import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Spinner,
} from '@pelatform/ui/default';
import { useForm } from '@pelatform/ui/re/react-hook-form';
import * as z from '@pelatform/ui/re/zod';
import { useAuth } from '@/hooks';
import { useCaptcha, useIsHydrated } from '@/hooks/private';
import { cn, getLocalizedError, getSearchParam } from '@/lib/utils';
import { Captcha } from '../captcha/captcha';
import type { AuthFormProps } from './types';

export function MagicLinkForm({
  className,
  classNames,
  callbackURL: propCallbackURL,
  isSubmitting,
  localization: propLocalization,
  redirectTo: propRedirectTo,
  setIsSubmitting,
}: AuthFormProps) {
  const {
    authClient,
    basePath,
    baseURL,
    localization: contextLocalization,
    persistClient,
    redirectTo: contextRedirectTo,
    toast,
    viewPaths,
  } = useAuth();

  const localization = useMemo(
    () => ({ ...contextLocalization, ...propLocalization }),
    [contextLocalization, propLocalization],
  );

  const { captchaRef, getCaptchaHeaders, resetCaptcha } = useCaptcha(localization);
  const isHydrated = useIsHydrated();

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

  const formSchema = z.object({
    email: z.email({
      error: `${localization.EMAIL} ${localization.IS_INVALID}`,
    }),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  isSubmitting = isSubmitting || form.formState.isSubmitting;

  useEffect(() => {
    setIsSubmitting?.(form.formState.isSubmitting);
  }, [form.formState.isSubmitting, setIsSubmitting]);

  async function sendMagicLink({ email }: z.infer<typeof formSchema>) {
    try {
      const fetchOptions: BetterFetchOption = {
        throw: true,
        headers: await getCaptchaHeaders('/sign-in/magic-link'),
      };

      await authClient.signIn.magicLink({
        email,
        callbackURL: getCallbackURL(),
        fetchOptions,
      });

      toast({
        message: localization.MAGIC_LINK_EMAIL,
        icon: 'success',
      });

      form.reset();
    } catch (error) {
      toast({
        message: getLocalizedError({ error, localization }),
      });
      resetCaptcha();
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(sendMagicLink)}
        noValidate={isHydrated}
        className={cn('grid w-full gap-6', className, classNames?.base)}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={classNames?.label}>{localization.EMAIL}</FormLabel>

              <FormControl>
                <Input
                  type="email"
                  className={classNames?.input}
                  placeholder={localization.EMAIL_PLACEHOLDER}
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>

              <FormMessage className={classNames?.error} />
            </FormItem>
          )}
        />

        <Captcha ref={captchaRef} localization={localization} action="/sign-in/magic-link" />

        <Button
          type="submit"
          className={cn('w-full', classNames?.button, classNames?.primaryButton)}
          disabled={isSubmitting}
        >
          {isSubmitting ? <Spinner /> : localization.MAGIC_LINK_ACTION}
        </Button>
      </form>
    </Form>
  );
}
