'use client';

import { useEffect, useMemo, useState } from 'react';
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
  InputOTP,
  Spinner,
} from '@pelatform/ui/default';
import { useForm } from '@pelatform/ui/re/react-hook-form';
import * as z from '@pelatform/ui/re/zod';
import { useAuth } from '@/hooks';
import { useIsHydrated, useOnSuccessTransition } from '@/hooks/private';
import { cn, getLocalizedError } from '@/lib/utils';
import { OTPInputGroup } from './partials/otp-input-group';
import type { AuthFormProps } from './types';

export function EmailOTPForm(props: AuthFormProps) {
  const [email, setEmail] = useState<string | undefined>();

  if (!email) {
    return <EmailForm {...props} setEmail={setEmail} />;
  }

  return <OTPForm {...props} email={email} />;
}

function EmailForm({
  className,
  classNames,
  isSubmitting,
  localization: localizationProp,
  setIsSubmitting,
  setEmail,
}: AuthFormProps & {
  setEmail: (email: string) => void;
}) {
  const { authClient, localization: localizationContext, toast } = useAuth();

  const localization = useMemo(
    () => ({ ...localizationContext, ...localizationProp }),
    [localizationContext, localizationProp],
  );

  const isHydrated = useIsHydrated();

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

  async function sendEmailOTP({ email }: z.infer<typeof formSchema>) {
    try {
      await authClient.emailOtp.sendVerificationOtp({
        email,
        type: 'sign-in',
        fetchOptions: { throw: true },
      });

      toast({
        message: localization.EMAIL_OTP_VERIFICATION_SENT,
        icon: 'success',
      });

      setEmail(email);
    } catch (error) {
      toast({
        message: getLocalizedError({ error, localization }),
      });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(sendEmailOTP)}
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

        <Button
          type="submit"
          className={cn('w-full', classNames?.button, classNames?.primaryButton)}
          disabled={isSubmitting}
        >
          {isSubmitting ? <Spinner /> : localization.EMAIL_OTP_SEND_ACTION}
        </Button>
      </form>
    </Form>
  );
}

function OTPForm({
  className,
  classNames,
  isSubmitting,
  localization: localizationProp,
  otpSeparators = 0,
  redirectTo: redirectToProp,
  setIsSubmitting,
  email,
}: AuthFormProps & {
  email: string;
}) {
  const { authClient, localization: localizationContext, toast } = useAuth();

  const localization = useMemo(
    () => ({ ...localizationContext, ...localizationProp }),
    [localizationContext, localizationProp],
  );

  const { onSuccess, isPending: transitionPending } = useOnSuccessTransition(redirectToProp);

  const formSchema = z.object({
    code: z
      .string()
      .min(1, {
        error: `${localization.EMAIL_OTP} ${localization.IS_REQUIRED}`,
      })
      .min(6, {
        error: `${localization.EMAIL_OTP} ${localization.IS_INVALID}`,
      }),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: '',
    },
  });

  isSubmitting = isSubmitting || form.formState.isSubmitting || transitionPending;

  useEffect(() => {
    setIsSubmitting?.(form.formState.isSubmitting || transitionPending);
  }, [form.formState.isSubmitting, transitionPending, setIsSubmitting]);

  async function verifyCode({ code }: z.infer<typeof formSchema>) {
    try {
      await authClient.signIn.emailOtp({
        email,
        otp: code,
        fetchOptions: { throw: true },
      });

      await onSuccess();
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
        onSubmit={form.handleSubmit(verifyCode)}
        className={cn('grid w-full gap-6', className, classNames?.base)}
      >
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={classNames?.label}>{localization.EMAIL_OTP}</FormLabel>

              <FormControl>
                <InputOTP
                  {...field}
                  maxLength={6}
                  onChange={(value) => {
                    field.onChange(value);
                    if (value.length === 6) {
                      form.handleSubmit(verifyCode)();
                    }
                  }}
                  containerClassName={classNames?.otpInputContainer}
                  className={classNames?.otpInput}
                  disabled={isSubmitting}
                >
                  <OTPInputGroup otpSeparators={otpSeparators} />
                </InputOTP>
              </FormControl>

              <FormMessage className={classNames?.error} />
            </FormItem>
          )}
        />

        <div className="grid gap-4">
          <Button
            type="submit"
            className={cn(classNames?.button, classNames?.primaryButton)}
            disabled={isSubmitting}
          >
            {isSubmitting && <Spinner />}
            {localization.EMAIL_OTP_VERIFY_ACTION}
          </Button>
        </div>
      </form>
    </Form>
  );
}
