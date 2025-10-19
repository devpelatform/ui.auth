'use client';

import { useEffect, useMemo } from 'react';
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
import { useAuth } from '@/hooks';
import { useOnSuccessTransition } from '@/hooks/private';
import { cn, getLocalizedError } from '@/lib/utils';
import type { AuthFormProps } from './types';

export function RecoverAccountForm({
  className,
  classNames,
  isSubmitting,
  localization: localizationProp,
  redirectTo: redirectToProp,
  setIsSubmitting,
}: AuthFormProps) {
  const { authClient, localization: localizationContext, toast } = useAuth();

  const localization = useMemo(
    () => ({ ...localizationContext, ...localizationProp }),
    [localizationContext, localizationProp],
  );

  const { onSuccess, isPending: transitionPending } = useOnSuccessTransition(redirectToProp);

  const formSchema = z.object({
    code: z.string().min(1, { error: localization.BACKUP_CODE_REQUIRED }),
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

  async function verifyBackupCode({ code }: z.infer<typeof formSchema>) {
    try {
      await authClient.twoFactor.verifyBackupCode({
        code,
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
        onSubmit={form.handleSubmit(verifyBackupCode)}
        className={cn('grid gap-6', className, classNames?.base)}
      >
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={classNames?.label}>{localization.BACKUP_CODE}</FormLabel>

              <FormControl>
                <Input
                  placeholder={localization.BACKUP_CODE_PLACEHOLDER}
                  autoComplete="off"
                  className={classNames?.input}
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
          className={cn(classNames?.button, classNames?.primaryButton)}
          disabled={isSubmitting}
        >
          {isSubmitting ? <Spinner /> : localization.RECOVER_ACCOUNT_ACTION}
        </Button>
      </form>
    </Form>
  );
}
