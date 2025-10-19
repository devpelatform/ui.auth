'use client';

import { useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  CardContent,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
  Skeleton,
} from '@pelatform/ui/default';
import { useForm } from '@pelatform/ui/re/react-hook-form';
import * as z from '@pelatform/ui/re/zod';
import { useAuth, useAuthHooks } from '@/hooks';
import { cn, getLocalizedError } from '@/lib/utils';
import { SettingsCard, type SettingsCardProps } from '../../shared/settings-card';

export function FormEmailCard({
  className,
  classNames,
  localization: localizationProp,
  ...props
}: SettingsCardProps) {
  const { authClient, emailVerification, localization: localizationContext, toast } = useAuth();
  const { useSession } = useAuthHooks();
  const { data: sessionData, isPending, refetch } = useSession();

  const localization = useMemo(
    () => ({ ...localizationContext, ...localizationProp }),
    [localizationContext, localizationProp],
  );

  const [resendDisabled, setResendDisabled] = useState(false);

  const formSchema = z.object({
    email: z.email({ error: localization.INVALID_EMAIL }),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    values: {
      email: sessionData?.user.email || '',
    },
  });

  const resendForm = useForm();

  const { isSubmitting } = form.formState;

  const changeEmail = async ({ email }: z.infer<typeof formSchema>) => {
    if (email === sessionData?.user.email) {
      await new Promise((resolve) => setTimeout(resolve));
      toast({
        message: localization.EMAIL_IS_THE_SAME,
      });
      return;
    }

    try {
      await authClient.changeEmail({
        newEmail: email,
        callbackURL: window.location.pathname,
        fetchOptions: { throw: true },
      });

      if (sessionData?.user.emailVerified) {
        toast({
          message: localization.EMAIL_VERIFY_CHANGE!,
          icon: 'success',
        });
      } else {
        await refetch?.();
        toast({
          message: `${localization.EMAIL} ${localization.UPDATED_SUCCESSFULLY}`,
          icon: 'success',
        });
      }
    } catch (error) {
      toast({
        message: getLocalizedError({ error, localization }),
      });
    }
  };

  const resendVerification = async () => {
    if (!sessionData) return;
    const email = sessionData.user.email;

    setResendDisabled(true);

    try {
      await authClient.sendVerificationEmail({
        email,
        fetchOptions: { throw: true },
      });

      toast({
        message: localization.EMAIL_VERIFICATION!,
        icon: 'success',
      });
    } catch (error) {
      toast({
        message: getLocalizedError({ error, localization }),
      });
      setResendDisabled(false);
      throw error;
    }
  };

  return (
    <>
      <Form {...form}>
        <form noValidate onSubmit={form.handleSubmit(changeEmail)}>
          <SettingsCard
            className={className}
            classNames={classNames}
            description={localization.EMAIL_DESCRIPTION}
            instructions={localization.EMAIL_INSTRUCTIONS}
            isPending={isPending}
            title={localization.EMAIL}
            actionLabel={localization.SAVE}
            {...props}
          >
            <CardContent className={classNames?.content}>
              {isPending ? (
                <Skeleton className={cn('h-9 w-full', classNames?.skeleton)} />
              ) : (
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          className={classNames?.input}
                          placeholder={localization.EMAIL_PLACEHOLDER}
                          type="email"
                          disabled={isSubmitting}
                          {...field}
                        />
                      </FormControl>

                      <FormMessage className={classNames?.error} />
                    </FormItem>
                  )}
                />
              )}
            </CardContent>
          </SettingsCard>
        </form>
      </Form>

      {emailVerification && sessionData?.user && !sessionData?.user.emailVerified && (
        <Form {...resendForm}>
          <form onSubmit={resendForm.handleSubmit(resendVerification)}>
            <SettingsCard
              className={className}
              classNames={classNames}
              title={localization.VERIFY_YOUR_EMAIL}
              description={localization.VERIFY_YOUR_EMAIL_DESCRIPTION}
              actionLabel={localization.RESEND_VERIFICATION_EMAIL}
              disabled={resendDisabled}
              {...props}
            />
          </form>
        </Form>
      )}
    </>
  );
}
