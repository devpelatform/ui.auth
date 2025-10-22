'use client';

import { useEffect, useMemo, useRef } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Spinner,
} from '@pelatform/ui/default';
import { useForm } from '@pelatform/ui/re/react-hook-form';
import * as z from '@pelatform/ui/re/zod';
import { useAuth } from '@/hooks';
import { useLocalization } from '@/hooks/private';
import { cn, getLocalizedError, getPasswordSchema } from '@/lib/utils';
import { PasswordInput } from '../shared/password-input';
import type { AuthFormProps } from './types';

export function ResetPasswordForm({
  className,
  classNames,
  localization: localizationProp,
  passwordValidation: passwordValidationProp,
}: AuthFormProps) {
  const { authClient, basePath, credentials, viewPaths, navigate, toast } = useAuth();

  const localization = useLocalization(localizationProp);

  const confirmPasswordEnabled = credentials?.confirmPassword;
  const passwordValidationContext = credentials?.passwordValidation;

  const passwordValidation = useMemo(
    () => ({ ...passwordValidationContext, ...passwordValidationProp }),
    [passwordValidationContext, passwordValidationProp],
  );

  const tokenChecked = useRef(false);

  const formSchema = z
    .object({
      newPassword: getPasswordSchema(passwordValidation, {
        PASSWORD_REQUIRED: localization.NEW_PASSWORD_REQUIRED,
        PASSWORD_TOO_SHORT: localization.PASSWORD_TOO_SHORT,
        PASSWORD_TOO_LONG: localization.PASSWORD_TOO_LONG,
        INVALID_PASSWORD: localization.INVALID_PASSWORD,
      }),
      confirmPassword: confirmPasswordEnabled
        ? getPasswordSchema(passwordValidation, {
            PASSWORD_REQUIRED: localization.CONFIRM_PASSWORD_REQUIRED,
            PASSWORD_TOO_SHORT: localization.PASSWORD_TOO_SHORT,
            PASSWORD_TOO_LONG: localization.PASSWORD_TOO_LONG,
            INVALID_PASSWORD: localization.INVALID_PASSWORD,
          })
        : z.string().optional(),
    })
    .refine((data) => !confirmPasswordEnabled || data.newPassword === data.confirmPassword, {
      error: localization.PASSWORDS_DO_NOT_MATCH,
      path: ['confirmPassword'],
    });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  useEffect(() => {
    if (tokenChecked.current) return;
    tokenChecked.current = true;

    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get('token');

    if (!token || token === 'INVALID_TOKEN') {
      navigate(`${basePath}/${viewPaths.SIGN_IN}${window.location.search}`);
      toast({ message: localization.INVALID_TOKEN });
    }
  }, [basePath, navigate, toast, viewPaths, localization]);

  async function resetPassword({ newPassword }: z.infer<typeof formSchema>) {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const token = searchParams.get('token') as string;

      await authClient.resetPassword({
        newPassword,
        token,
        fetchOptions: { throw: true },
      });

      toast({
        message: localization.RESET_PASSWORD_SUCCESS,
        icon: 'success',
      });

      navigate(`${basePath}/${viewPaths.SIGN_IN}${window.location.search}`);
    } catch (error) {
      toast({
        message: getLocalizedError({ error, localization }),
      });

      form.reset();
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(resetPassword)}
        className={cn('grid w-full gap-6', className, classNames?.base)}
      >
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={classNames?.label}>{localization.NEW_PASSWORD}</FormLabel>

              <FormControl>
                <PasswordInput
                  autoComplete="new-password"
                  className={classNames?.input}
                  placeholder={localization.NEW_PASSWORD_PLACEHOLDER}
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>

              <FormMessage className={classNames?.error} />
            </FormItem>
          )}
        />

        {confirmPasswordEnabled && (
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={classNames?.label}>{localization.CONFIRM_PASSWORD}</FormLabel>

                <FormControl>
                  <PasswordInput
                    autoComplete="new-password"
                    className={classNames?.input}
                    placeholder={localization.CONFIRM_PASSWORD_PLACEHOLDER}
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>

                <FormMessage className={classNames?.error} />
              </FormItem>
            )}
          />
        )}

        <Button
          type="submit"
          className={cn('w-full', classNames?.button, classNames?.primaryButton)}
          disabled={isSubmitting}
        >
          {isSubmitting ? <Spinner /> : localization.RESET_PASSWORD_ACTION}
        </Button>
      </form>
    </Form>
  );
}
