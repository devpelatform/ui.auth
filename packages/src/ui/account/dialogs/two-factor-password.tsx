'use client';

import { useState } from 'react';
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
import { useAuth } from '../../../hooks/index';
import { useLocalization } from '../../../hooks/private';
import { cn, getLocalizedError } from '../../../lib/utils';
import type { DialogComponentProps } from '../../../types/ui';
import { DialogComponent, DialogFooterComponent } from '../../shared/components/dialog';
import { PasswordInput } from '../../shared/password-input';
import { BackupCodesDialog } from './backup-codes';

export function TwoFactorPasswordDialog({
  classNames,
  localization: localizationProp,
  onOpenChange,
  title,
  description,
  isTwoFactorEnabled,
  ...props
}: DialogComponentProps & { isTwoFactorEnabled: boolean }) {
  const { authClient, basePath, navigate, toast, twoFactor, viewPaths } = useAuth();

  const localization = useLocalization(localizationProp);

  const [showBackupCodesDialog, setShowBackupCodesDialog] = useState(false);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [totpURI, setTotpURI] = useState<string | null>(null);

  const formSchema = z.object({
    password: z.string().min(1, { error: localization.PASSWORD_REQUIRED }),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
    },
  });

  const { isSubmitting } = form.formState;

  async function enableTwoFactor({ password }: z.infer<typeof formSchema>) {
    try {
      const response = await authClient.twoFactor.enable({
        password,
        fetchOptions: { throw: true },
      });

      onOpenChange?.(false);
      setBackupCodes(response.backupCodes);

      if (twoFactor?.includes('totp')) {
        setTotpURI(response.totpURI);
      }

      setTimeout(() => {
        setShowBackupCodesDialog(true);
      }, 250);
    } catch (error) {
      toast({
        message: getLocalizedError({ error, localization }),
      });
    }
  }

  async function disableTwoFactor({ password }: z.infer<typeof formSchema>) {
    try {
      await authClient.twoFactor.disable({
        password,
        fetchOptions: { throw: true },
      });

      toast({
        message: localization.TWO_FACTOR_DISABLED,
        icon: 'success',
      });

      onOpenChange?.(false);
    } catch (error) {
      toast({
        message: getLocalizedError({ error, localization }),
      });
    }
  }

  return (
    <>
      <DialogComponent
        classNames={classNames}
        localization={localization}
        onOpenChange={onOpenChange}
        title={title || localization.TWO_FACTOR}
        description={
          description || isTwoFactorEnabled
            ? localization.TWO_FACTOR_DISABLE_INSTRUCTIONS
            : localization.TWO_FACTOR_ENABLE_INSTRUCTIONS
        }
        disableFooter={true}
        {...props}
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(isTwoFactorEnabled ? disableTwoFactor : enableTwoFactor)}
          >
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={classNames?.label}>{localization.PASSWORD}</FormLabel>

                  <FormControl>
                    <PasswordInput
                      className={classNames?.input}
                      placeholder={localization.PASSWORD_PLACEHOLDER}
                      autoComplete="current-password"
                      enableToggle
                      {...field}
                    />
                  </FormControl>

                  <FormMessage className={classNames?.error} />
                </FormItem>
              )}
            />

            <DialogFooterComponent
              classNames={classNames}
              localization={localization}
              onOpenChange={onOpenChange}
              cancelButton={true}
              cancelButtonDisabled={isSubmitting}
              button={
                <Button
                  type="submit"
                  className={cn(classNames?.button, classNames?.primaryButton)}
                  disabled={isSubmitting}
                >
                  {isSubmitting && <Spinner />}
                  {isTwoFactorEnabled
                    ? localization.DISABLE_TWO_FACTOR
                    : localization.ENABLE_TWO_FACTOR}
                </Button>
              }
            />
          </form>
        </Form>
      </DialogComponent>

      <BackupCodesDialog
        classNames={classNames}
        localization={localization}
        open={showBackupCodesDialog}
        onOpenChange={(open: boolean) => {
          setShowBackupCodesDialog(open);
          if (!open) {
            const url = `${basePath}/${viewPaths.TWO_FACTOR}`;
            navigate(twoFactor?.includes('totp') && totpURI ? `${url}?totpURI=${totpURI}` : url);
          }
        }}
        backupCodes={backupCodes}
      />
    </>
  );
}
