'use client';

import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

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
import { useAuth } from '../../hooks/index';
import { useCaptcha, useIsHydrated, useLocalization } from '../../hooks/private';
import { cn, getLocalizedError } from '../../lib/utils';
import type { BetterFetchOption } from '../../types/auth';
import { Captcha } from '../captcha/captcha';
import type { AuthFormProps } from './types';

export function ForgotPasswordForm({
  className,
  classNames,
  isSubmitting,
  localization: localizationProp,
  setIsSubmitting,
}: AuthFormProps) {
  const { authClient, basePath, baseURL, navigate, toast, viewPaths } = useAuth();

  const localization = useLocalization(localizationProp);
  const { captchaRef, getCaptchaHeaders, resetCaptcha } = useCaptcha(localization);
  const isHydrated = useIsHydrated();

  const formSchema = z.object({
    email: z
      .email({
        error: `${localization.EMAIL} ${localization.IS_INVALID}`,
      })
      .min(1, {
        error: `${localization.EMAIL} ${localization.IS_REQUIRED}`,
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

  async function forgotPassword({ email }: z.infer<typeof formSchema>) {
    try {
      const fetchOptions: BetterFetchOption = {
        throw: true,
        headers: await getCaptchaHeaders('/forget-password'),
      };

      await authClient.requestPasswordReset({
        email,
        redirectTo: `${baseURL}${basePath}/${viewPaths.RESET_PASSWORD}`,
        fetchOptions,
      });

      toast({
        message: localization.FORGOT_PASSWORD_EMAIL,
        icon: 'success',
      });

      navigate(`${basePath}/${viewPaths.SIGN_IN}${window.location.search}`);
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
        onSubmit={form.handleSubmit(forgotPassword)}
        className={cn('grid w-full gap-6', className, classNames?.base)}
        noValidate={isHydrated}
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

        <Captcha ref={captchaRef} localization={localization} action="/forget-password" />

        <Button
          type="submit"
          className={cn('w-full', classNames?.button, classNames?.primaryButton)}
          disabled={isSubmitting}
        >
          {isSubmitting ? <Spinner /> : localization.FORGOT_PASSWORD_ACTION}
        </Button>
      </form>
    </Form>
  );
}
