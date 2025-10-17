'use client';

import { useEffect, useMemo } from 'react';
import type { BetterFetchOption } from '@better-fetch/fetch';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Button,
  Checkbox,
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
import { useCaptcha, useIsHydrated, useOnSuccessTransition } from '@/hooks/private';
import { cn, getLocalizedError, getPasswordSchema, isValidEmail } from '@/lib/utils';
import { Captcha } from '../captcha/captcha';
import { PasswordInput } from '../shared/password-input';
import type { AuthFormProps } from './types';

export function SignInForm({
  className,
  classNames,
  isSubmitting,
  localization: propLocalization,
  redirectTo,
  setIsSubmitting,
  passwordValidation: propPasswordValidation,
}: AuthFormProps) {
  const {
    authClient,
    basePath,
    credentials,
    localization: contextLocalization,
    viewPaths,
    navigate,
    toast,
    Link,
  } = useAuth();

  const localization = useMemo(
    () => ({ ...contextLocalization, ...propLocalization }),
    [contextLocalization, propLocalization],
  );

  const { captchaRef, getCaptchaHeaders, resetCaptcha } = useCaptcha(localization);
  const isHydrated = useIsHydrated();
  const { onSuccess, isPending: transitionPending } = useOnSuccessTransition(redirectTo);

  const rememberMeEnabled = credentials?.rememberMe;
  const usernameEnabled = credentials?.username;
  const contextPasswordValidation = credentials?.passwordValidation;

  const passwordValidation = useMemo(
    () => ({ ...contextPasswordValidation, ...propPasswordValidation }),
    [contextPasswordValidation, propPasswordValidation],
  );

  const formSchema = z.object({
    email: usernameEnabled
      ? z.string().min(1, {
          error: `${localization.USERNAME} ${localization.IS_REQUIRED}`,
        })
      : z.email({
          error: `${localization.EMAIL} ${localization.IS_INVALID}`,
        }),
    password: getPasswordSchema(passwordValidation, localization),
    rememberMe: z.boolean().optional(),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: !rememberMeEnabled,
    },
  });

  isSubmitting = isSubmitting || form.formState.isSubmitting || transitionPending;

  useEffect(() => {
    setIsSubmitting?.(form.formState.isSubmitting || transitionPending);
  }, [form.formState.isSubmitting, transitionPending, setIsSubmitting]);

  async function signIn({ email, password, rememberMe }: z.infer<typeof formSchema>) {
    try {
      let response: Record<string, unknown> = {};

      if (usernameEnabled && !isValidEmail(email)) {
        const fetchOptions: BetterFetchOption = {
          throw: true,
          headers: await getCaptchaHeaders('/sign-in/username'),
        };

        response = await authClient.signIn.username({
          username: email,
          password,
          rememberMe,
          fetchOptions,
        });
      } else {
        const fetchOptions: BetterFetchOption = {
          throw: true,
          headers: await getCaptchaHeaders('/sign-in/email'),
        };

        response = await authClient.signIn.email({
          email,
          password,
          rememberMe,
          fetchOptions,
        });
      }

      if (response.twoFactorRedirect) {
        navigate(`${basePath}/${viewPaths.TWO_FACTOR}${window.location.search}`);
      } else {
        await onSuccess();
      }
    } catch (error) {
      form.resetField('password');
      resetCaptcha();

      toast({
        message: getLocalizedError({ error, localization }),
      });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(signIn)}
        noValidate={isHydrated}
        className={cn('grid w-full gap-6', className, classNames?.base)}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={classNames?.label}>
                {usernameEnabled ? localization.USERNAME : localization.EMAIL}
              </FormLabel>

              <FormControl>
                <Input
                  autoComplete={usernameEnabled ? 'username' : 'email'}
                  className={classNames?.input}
                  type={usernameEnabled ? 'text' : 'email'}
                  placeholder={
                    usernameEnabled
                      ? localization.SIGN_IN_USERNAME_PLACEHOLDER
                      : localization.EMAIL_PLACEHOLDER
                  }
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>

              <FormMessage className={classNames?.error} />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel className={classNames?.label}>{localization.PASSWORD}</FormLabel>

                {credentials?.forgotPassword && (
                  <Link
                    className={cn('text-sm hover:underline', classNames?.forgotPasswordLink)}
                    href={`${basePath}/${viewPaths.FORGOT_PASSWORD}${isHydrated ? window.location.search : ''}`}
                  >
                    {localization.FORGOT_PASSWORD_LINK}
                  </Link>
                )}
              </div>

              <FormControl>
                <PasswordInput
                  autoComplete="current-password"
                  className={classNames?.input}
                  placeholder={localization.PASSWORD_PLACEHOLDER}
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>

              <FormMessage className={classNames?.error} />
            </FormItem>
          )}
        />

        {rememberMeEnabled && (
          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <FormItem className="flex">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormLabel>{localization.REMEMBER_ME}</FormLabel>
              </FormItem>
            )}
          />
        )}

        <Captcha ref={captchaRef} localization={localization} action="/sign-in/email" />

        <Button
          type="submit"
          className={cn('w-full', classNames?.button, classNames?.primaryButton)}
          disabled={isSubmitting}
        >
          {isSubmitting ? <Spinner /> : localization.SIGN_IN_ACTION}
        </Button>
      </form>
    </Form>
  );
}
