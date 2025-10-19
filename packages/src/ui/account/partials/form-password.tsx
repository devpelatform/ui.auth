'use client';

import { useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  CardContent,
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
import type { AuthLocalization } from '@/lib/localization';
import { cn, getLocalizedError, getPasswordSchema } from '@/lib/utils';
import type { PasswordValidation } from '@/types/generals';
import { PasswordInput } from '../../shared/password-input';
import { SettingsCard, type SettingsCardClassNames } from '../../shared/settings-card';
import { InputFieldSkeleton } from '../../shared/settings-skeleton';

export interface FormPasswordCardProps {
  className?: string;
  classNames?: SettingsCardClassNames;
  accounts?: { providerId: string }[] | null;
  isPending?: boolean;
  localization?: AuthLocalization;
  skipHook?: boolean;
  passwordValidation?: PasswordValidation;
}

export function FormPasswordCard({
  className,
  classNames,
  accounts,
  isPending,
  localization: localizationProp,
  skipHook,
  passwordValidation: propPasswordValidation,
}: FormPasswordCardProps) {
  const {
    authClient,
    basePath,
    baseURL,
    credentials,
    localization: localizationContext,
    toast,
    viewPaths,
  } = useAuth();
  const { useSession, useListAccounts } = useAuthHooks();
  const { data: sessionData } = useSession();

  const localization = useMemo(
    () => ({ ...localizationContext, ...localizationProp }),
    [localizationContext, localizationProp],
  );

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
          <SettingsCard
            title={localization.SET_PASSWORD}
            description={localization.SET_PASSWORD_DESCRIPTION}
            actionLabel={localization.SET_PASSWORD}
            isPending={isPending}
            className={className}
            classNames={classNames}
          />
        </form>
      </Form>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(changePassword)}>
        <SettingsCard
          className={className}
          classNames={classNames}
          actionLabel={localization.SAVE}
          description={localization.CHANGE_PASSWORD_DESCRIPTION}
          instructions={localization.CHANGE_PASSWORD_INSTRUCTIONS}
          isPending={isPending}
          title={localization.CHANGE_PASSWORD}
        >
          <CardContent className={cn('grid gap-6', classNames?.content)}>
            {isPending || !accounts ? (
              <>
                <InputFieldSkeleton classNames={classNames} />
                <InputFieldSkeleton classNames={classNames} />

                {confirmPasswordEnabled && <InputFieldSkeleton classNames={classNames} />}
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
                          autoComplete="current-password"
                          placeholder={localization.CURRENT_PASSWORD_PLACEHOLDER}
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
                          autoComplete="new-password"
                          disabled={isSubmitting}
                          placeholder={localization.NEW_PASSWORD_PLACEHOLDER}
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
                            autoComplete="new-password"
                            placeholder={localization.CONFIRM_PASSWORD_PLACEHOLDER}
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
          </CardContent>
        </SettingsCard>
      </form>
    </Form>
  );
}
