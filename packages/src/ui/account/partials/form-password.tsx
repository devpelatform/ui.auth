'use client';

import { useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@pelatform/ui/default';
import { useForm } from '@pelatform/ui/re/react-hook-form';
import * as z from '@pelatform/ui/re/zod';
import { useAuth, useAuthHooks } from '@/hooks';
import { useLocalization } from '@/hooks/private';
import { cn, getLocalizedError, getPasswordSchema } from '@/lib/utils';
import type { PasswordValidation } from '@/types/generals';
import type { CardComponentProps } from '@/types/ui';
import { CardComponent } from '../../shared/components/card';
import { SkeletonInputComponent } from '../../shared/components/skeleton';
import { PasswordInput } from '../../shared/password-input';

export function FormPasswordCard({
  className,
  classNames,
  isPending,
  localization: localizationProp,
  accounts,
  passwordValidation: propPasswordValidation,
  skipHook,
  ...props
}: CardComponentProps & {
  accounts?: { providerId: string }[] | null;
  passwordValidation?: PasswordValidation;
  skipHook?: boolean;
}) {
  const { authClient, basePath, baseURL, credentials, toast, viewPaths } = useAuth();
  const { useSession, useListAccounts } = useAuthHooks();
  const { data: sessionData } = useSession();

  const localization = useLocalization(localizationProp);

  const confirmPasswordEnabled = credentials?.confirmPassword;
  const contextPasswordValidation = credentials?.passwordValidation;

  const passwordValidation = useMemo(
    () => ({ ...contextPasswordValidation, ...propPasswordValidation }),
    [contextPasswordValidation, propPasswordValidation],
  );

  if (!skipHook) {
    const result = useListAccounts();
    accounts = result.data;
    isPending = result.isPending;
  }

  const formSchema = z
    .object({
      currentPassword: getPasswordSchema(passwordValidation, localization),
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
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const setPasswordForm = useForm();

  const { isSubmitting } = form.formState;

  const setPassword = async () => {
    if (!sessionData) return;
    const email = sessionData?.user.email;

    try {
      await authClient.requestPasswordReset({
        email,
        redirectTo: `${baseURL}${basePath}/${viewPaths.RESET_PASSWORD}`,
        fetchOptions: { throw: true },
      });

      toast({
        message: localization.FORGOT_PASSWORD_EMAIL!,
        icon: 'success',
      });
    } catch (error) {
      toast({
        message: getLocalizedError({ error, localization }),
      });
    }
  };

  const changePassword = async ({ currentPassword, newPassword }: z.infer<typeof formSchema>) => {
    try {
      await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
        fetchOptions: { throw: true },
      });

      toast({
        message: localization.CHANGE_PASSWORD_SUCCESS!,
        icon: 'success',
      });
    } catch (error) {
      toast({
        message: getLocalizedError({ error, localization }),
      });
    }

    form.reset();
  };

  const credentialsLinked = accounts?.some((acc) => acc.providerId === 'credential');

  if (!isPending && !credentialsLinked) {
    return (
      <Form {...setPasswordForm}>
        <form onSubmit={setPasswordForm.handleSubmit(setPassword)}>
          <CardComponent
            className={className}
            classNames={classNames}
            title={localization.SET_PASSWORD}
            description={localization.SET_PASSWORD_DESCRIPTION}
            actionLabel={localization.SET_PASSWORD}
            isPending={isPending}
            {...props}
          />
        </form>
      </Form>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(changePassword)}>
        <CardComponent
          className={className}
          classNames={classNames}
          title={localization.CHANGE_PASSWORD}
          description={localization.CHANGE_PASSWORD_DESCRIPTION}
          instructions={localization.CHANGE_PASSWORD_INSTRUCTIONS}
          actionLabel={localization.SAVE}
          disabled={isSubmitting}
          isPending={isPending}
          {...props}
        >
          <div className={cn('grid gap-4.5', classNames?.grid)}>
            {isPending || !accounts ? (
              <>
                <SkeletonInputComponent classNames={classNames} />
                <SkeletonInputComponent classNames={classNames} />
                {confirmPasswordEnabled && <SkeletonInputComponent classNames={classNames} />}
              </>
            ) : (
              <>
                <FormField
                  control={form.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={classNames?.label}>
                        {localization.CURRENT_PASSWORD}
                      </FormLabel>

                      <FormControl>
                        <PasswordInput
                          className={classNames?.input}
                          placeholder={localization.CURRENT_PASSWORD_PLACEHOLDER}
                          autoComplete="current-password"
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
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={classNames?.label}>
                        {localization.NEW_PASSWORD}
                      </FormLabel>

                      <FormControl>
                        <PasswordInput
                          className={classNames?.input}
                          placeholder={localization.NEW_PASSWORD_PLACEHOLDER}
                          autoComplete="new-password"
                          disabled={isSubmitting}
                          enableToggle
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
                        <FormLabel className={classNames?.label}>
                          {localization.CONFIRM_PASSWORD}
                        </FormLabel>

                        <FormControl>
                          <PasswordInput
                            className={classNames?.input}
                            placeholder={localization.CONFIRM_PASSWORD_PLACEHOLDER}
                            autoComplete="new-password"
                            disabled={isSubmitting}
                            enableToggle
                            {...field}
                          />
                        </FormControl>

                        <FormMessage className={classNames?.error} />
                      </FormItem>
                    )}
                  />
                )}
              </>
            )}
          </div>
        </CardComponent>
      </form>
    </Form>
  );
}
