'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import {
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
import { useAuth } from '../../../hooks/main';
import { useLocalization } from '../../../hooks/private';
import { useSession } from '../../../hooks/use-session';
import { cn, getLocalizedError } from '../../../lib/utils';
import type { CardComponentProps } from '../../../types/ui';
import { CardComponent } from '../../shared/components/card';

export function FormEmailCard({
  className,
  classNames,
  localization: localizationProp,
  ...props
}: CardComponentProps) {
  const { authClient, emailVerification, toast } = useAuth();
  const { data: sessionData, isPending, refetch: refetchSession } = useSession();

  const localization = useLocalization(localizationProp);

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
  const disableSubmit = isSubmitting || !form.formState.isValid || !form.formState.isDirty;

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
        await refetchSession?.();
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
          <CardComponent
            className={className}
            classNames={classNames}
            title={localization.EMAIL}
            description={localization.EMAIL_DESCRIPTION}
            instructions={localization.EMAIL_INSTRUCTIONS}
            actionLabel={localization.SAVE}
            disabled={disableSubmit}
            isPending={isPending}
            {...props}
          >
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
                        type="email"
                        variant="lg"
                        className={classNames?.input}
                        placeholder={localization.EMAIL_PLACEHOLDER}
                        disabled={isSubmitting}
                        {...field}
                        value={field.value as string}
                      />
                    </FormControl>

                    <FormMessage className={classNames?.error} />
                  </FormItem>
                )}
              />
            )}
          </CardComponent>
        </form>
      </Form>

      {emailVerification && sessionData?.user && !sessionData?.user.emailVerified && (
        <Form {...resendForm}>
          <form onSubmit={resendForm.handleSubmit(resendVerification)}>
            <CardComponent
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
