'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { BetterFetchError } from '@better-fetch/fetch';
import { zodResolver } from '@hookform/resolvers/zod';
import { QrCodeIcon, SendIcon } from 'lucide-react';
import QRCode from 'qrcode';

import {
  Button,
  Checkbox,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  InputOTP,
  Label,
  Spinner,
} from '@pelatform/ui/default';
import { useForm } from '@pelatform/ui/re/react-hook-form';
import * as z from '@pelatform/ui/re/zod';
import { useAuth } from '../../hooks/main';
import { useIsHydrated, useLocalization, useOnSuccessTransition } from '../../hooks/private';
import { useSession } from '../../hooks/use-session';
import { cn, getLocalizedError, getSearchParam } from '../../lib/utils';
import type { User } from '../../types/auth';
import { OTPInputGroup } from './partials/otp-input-group';
import type { AuthFormProps } from './types';

export function TwoFactorForm({
  className,
  classNames,
  isSubmitting,
  localization: localizationProp,
  otpSeparators = 1,
  redirectTo: redirectToProp,
  setIsSubmitting,
}: AuthFormProps) {
  const { authClient, basePath, twoFactor, viewPaths, toast, Link } = useAuth();
  const { data: sessionData } = useSession();
  const isTwoFactorEnabled = (sessionData?.user as User)?.twoFactorEnabled;

  const localization = useLocalization(localizationProp);
  const { onSuccess, isPending: transitionPending } = useOnSuccessTransition(redirectToProp);
  const isHydrated = useIsHydrated();
  const totpURI = isHydrated ? getSearchParam('totpURI') : null;

  const initialSendRef = useRef(false);
  const [method, setMethod] = useState<'totp' | 'otp' | null>(
    twoFactor?.length === 1 ? twoFactor[0] : null,
  );

  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  const formSchema = z.object({
    code: z
      .string()
      .min(1, {
        error: `${localization.ONE_TIME_PASSWORD} ${localization.IS_REQUIRED}`,
      })
      .min(6, {
        error: `${localization.ONE_TIME_PASSWORD} ${localization.IS_INVALID}`,
      }),
    trustDevice: z.boolean().optional(),
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

  // biome-ignore lint/correctness/useExhaustiveDependencies: ignore
  useEffect(() => {
    if (method === 'otp' && cooldownSeconds <= 0 && !initialSendRef.current) {
      initialSendRef.current = true;
      sendOtp();
    }
  }, [method]);

  useEffect(() => {
    if (cooldownSeconds <= 0) return;

    const timer = setTimeout(() => {
      setCooldownSeconds((prev) => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [cooldownSeconds]);

  const sendOtp = useCallback(async () => {
    if (isSendingOtp || cooldownSeconds > 0) return;

    try {
      setIsSendingOtp(true);
      await authClient.twoFactor.sendOtp({
        fetchOptions: { throw: true },
      });
      setCooldownSeconds(60);
    } catch (error) {
      toast({
        message: getLocalizedError({ error, localization }),
      });

      if ((error as BetterFetchError).error.code === 'INVALID_TWO_FACTOR_COOKIE') {
        history.back();
      }
    }

    initialSendRef.current = false;
    setIsSendingOtp(false);
  }, [isSendingOtp, cooldownSeconds, authClient, localization, toast]);

  async function verifyCode({ code, trustDevice }: z.infer<typeof formSchema>) {
    try {
      const verifyMethod =
        method === 'totp' ? authClient.twoFactor.verifyTotp : authClient.twoFactor.verifyOtp;

      await verifyMethod({
        code,
        trustDevice,
        fetchOptions: { throw: true },
      });

      await onSuccess();

      if (sessionData && !isTwoFactorEnabled) {
        toast({
          message: localization.TWO_FACTOR_ENABLED,
          icon: 'success',
        });
      }
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
        {twoFactor?.includes('totp') && totpURI && method === 'totp' && (
          <div className="space-y-3">
            <Label className={cn('block', classNames?.label)}>
              {localization.TWO_FACTOR_TOTP_LABEL}
            </Label>
            <QRCodeComponent className={classNames?.qrCode} value={totpURI} />
          </div>
        )}

        {method !== null && (
          <>
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel className={classNames?.label}>
                      {localization.ONE_TIME_PASSWORD}
                    </FormLabel>

                    <Link
                      className={cn('text-sm hover:underline', classNames?.forgotPasswordLink)}
                      href={`${basePath}/${viewPaths.RECOVER_ACCOUNT}${isHydrated ? window.location.search : ''}`}
                    >
                      {localization.FORGOT_AUTHENTICATOR}
                    </Link>
                  </div>

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

            <FormField
              control={form.control}
              name="trustDevice"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        className={classNames?.checkbox}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormLabel className={classNames?.label}>{localization.TRUST_DEVICE}</FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </>
        )}

        <div className="grid gap-4">
          {method !== null && (
            <Button
              type="submit"
              disabled={isSubmitting}
              className={cn(classNames?.button, classNames?.primaryButton)}
            >
              {isSubmitting && <Spinner />}
              {localization.TWO_FACTOR_ACTION}
            </Button>
          )}

          {method === 'otp' && twoFactor?.includes('otp') && (
            <Button
              type="button"
              variant="outline"
              onClick={sendOtp}
              disabled={cooldownSeconds > 0 || isSendingOtp || isSubmitting}
              className={cn(classNames?.button, classNames?.outlineButton)}
            >
              {isSendingOtp ? <Spinner /> : <SendIcon className={classNames?.icon} />}
              {localization.RESEND_CODE}
              {cooldownSeconds > 0 && ` (${cooldownSeconds})`}
            </Button>
          )}

          {method !== 'otp' && twoFactor?.includes('otp') && (
            <Button
              type="button"
              variant="secondary"
              className={cn(classNames?.button, classNames?.secondaryButton)}
              onClick={() => setMethod('otp')}
              disabled={isSubmitting}
            >
              <SendIcon className={classNames?.icon} />
              {localization.SEND_VERIFICATION_CODE}
            </Button>
          )}

          {method !== 'totp' && twoFactor?.includes('totp') && (
            <Button
              type="button"
              variant="secondary"
              className={cn(classNames?.button, classNames?.secondaryButton)}
              onClick={() => setMethod('totp')}
              disabled={isSubmitting}
            >
              <QrCodeIcon className={classNames?.icon} />
              {localization.CONTINUE_WITH_AUTHENTICATOR}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}

function QRCodeComponent({
  value,
  size = 128,
  level = 'M',
  as = 'svg',
  className,
}: {
  value: string;
  size?: number; // px
  level?: 'L' | 'M' | 'Q' | 'H';
  as?: 'svg' | 'img'; // render as inline SVG string or <img src="data:...">
  className?: string;
}) {
  const [src, setSrc] = useState<string>('');

  const opts = useMemo(
    () => ({ errorCorrectionLevel: level, margin: 1, width: size }),
    [level, size],
  );

  useEffect(() => {
    let cancelled = false;

    if (as === 'img') {
      QRCode.toDataURL(value, opts).then((url) => !cancelled && setSrc(url));
    } else {
      // inline SVG string
      QRCode.toString(value, { ...opts, type: 'svg' }).then((svg) => {
        if (!cancelled) setSrc(svg);
      });
    }

    return () => {
      cancelled = true;
    };
  }, [value, opts, as]);

  if (!src) return null;

  if (as === 'img') {
    return <img src={src} width={size} height={size} alt="QR code" className={className} />;
  }

  // Inline SVG – no extra request, stylable with CSS
  return (
    <span
      className={cn('block', className)}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: disable
      dangerouslySetInnerHTML={{ __html: src }}
    />
  );
}
