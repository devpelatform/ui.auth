'use client';

import { type ComponentProps, useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckIcon, CopyIcon, Loader2 } from 'lucide-react';

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { cn, getLocalizedError } from '@/lib/utils';
import type { User } from '@/types/auth';
import { PasswordInput } from '../../shared/password-input';
import { SettingsCard, type SettingsCardClassNames } from '../../shared/settings-card';

export interface TwoFactorCardProps {
  className?: string;
  classNames?: SettingsCardClassNames;
  localization?: AuthLocalization;
}

export function TwoFactorCard({
  className,
  classNames,
  localization: localizationProp,
}: TwoFactorCardProps) {
  const { localization: localizationContext } = useAuth();
  const { useSession } = useAuthHooks();
  const { data: sessionData, isPending } = useSession();

  const localization = useMemo(
    () => ({ ...localizationContext, ...localizationProp }),
    [localizationContext, localizationProp],
  );

  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const isTwoFactorEnabled = (sessionData?.user as User)?.twoFactorEnabled;

  return (
    <div>
      <SettingsCard
        className={className}
        classNames={classNames}
        actionLabel={
          isTwoFactorEnabled ? localization.DISABLE_TWO_FACTOR : localization.ENABLE_TWO_FACTOR
        }
        description={localization.TWO_FACTOR_CARD_DESCRIPTION}
        instructions={
          isTwoFactorEnabled
            ? localization.TWO_FACTOR_DISABLE_INSTRUCTIONS
            : localization.TWO_FACTOR_ENABLE_INSTRUCTIONS
        }
        isPending={isPending}
        title={localization.TWO_FACTOR}
        action={() => setShowPasswordDialog(true)}
      />

      <TwoFactorPasswordDialog
        classNames={classNames}
        open={showPasswordDialog}
        onOpenChange={setShowPasswordDialog}
        isTwoFactorEnabled={!!isTwoFactorEnabled}
        localization={localization}
      />
    </div>
  );
}

export interface TwoFactorPasswordDialogProps extends ComponentProps<typeof Dialog> {
  classNames?: SettingsCardClassNames;
  isTwoFactorEnabled: boolean;
  localization?: AuthLocalization;
}

export function TwoFactorPasswordDialog({
  classNames,
  onOpenChange,
  isTwoFactorEnabled,
  localization: localizationProp,
  ...props
}: TwoFactorPasswordDialogProps) {
  const {
    authClient,
    basePath,
    localization: localizationContext,
    navigate,
    toast,
    twoFactor,
    viewPaths,
  } = useAuth();

  const localization = useMemo(
    () => ({ ...localizationContext, ...localizationProp }),
    [localizationContext, localizationProp],
  );

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
      <Dialog onOpenChange={onOpenChange} {...props}>
        <DialogContent className={cn('sm:max-w-md', classNames?.dialog)}>
          <DialogHeader className={classNames?.dialog?.header}>
            <DialogTitle className={classNames?.title}>{localization.TWO_FACTOR}</DialogTitle>

            <DialogDescription className={classNames?.description}>
              {isTwoFactorEnabled
                ? localization.TWO_FACTOR_DISABLE_INSTRUCTIONS
                : localization.TWO_FACTOR_ENABLE_INSTRUCTIONS}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(isTwoFactorEnabled ? disableTwoFactor : enableTwoFactor)}
              className="grid gap-4"
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
                        {...field}
                      />
                    </FormControl>

                    <FormMessage className={classNames?.error} />
                  </FormItem>
                )}
              />

              <DialogFooter className={classNames?.dialog?.footer}>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => onOpenChange?.(false)}
                  className={cn(classNames?.button, classNames?.secondaryButton)}
                >
                  {localization.CANCEL}
                </Button>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className={cn(classNames?.button, classNames?.primaryButton)}
                >
                  {isSubmitting && <Loader2 className="animate-spin" />}
                  {isTwoFactorEnabled
                    ? localization.DISABLE_TWO_FACTOR
                    : localization.ENABLE_TWO_FACTOR}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <BackupCodesDialog
        classNames={classNames}
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

interface BackupCodesDialogProps extends ComponentProps<typeof Dialog> {
  classNames?: SettingsCardClassNames;
  backupCodes: string[];
}

export function BackupCodesDialog({
  classNames,
  backupCodes,
  onOpenChange,
  ...props
}: BackupCodesDialogProps) {
  const { localization } = useAuth();

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const codeText = backupCodes.join('\n');
    navigator.clipboard.writeText(codeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog onOpenChange={onOpenChange} {...props}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className={classNames?.dialog?.content}
      >
        <DialogHeader className={classNames?.dialog?.header}>
          <DialogTitle className={cn('text-lg md:text-xl', classNames?.title)}>
            {localization.BACKUP_CODES}
          </DialogTitle>

          <DialogDescription className={cn('text-xs md:text-sm', classNames?.description)}>
            {localization.BACKUP_CODES_DESCRIPTION}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-2">
          {backupCodes.map((code, index) => (
            <div key={index} className="rounded-md bg-muted p-2 text-center font-mono text-sm">
              {code}
            </div>
          ))}
        </div>

        <DialogFooter className={classNames?.dialog?.footer}>
          <Button
            type="button"
            variant="outline"
            onClick={handleCopy}
            disabled={copied}
            className={cn(classNames?.button, classNames?.outlineButton)}
          >
            {copied ? (
              <>
                <CheckIcon className={classNames?.icon} />
                {localization.COPIED_TO_CLIPBOARD}
              </>
            ) : (
              <>
                <CopyIcon className={classNames?.icon} />
                {localization.COPY_ALL_CODES}
              </>
            )}
          </Button>

          <Button
            type="button"
            onClick={() => onOpenChange?.(false)}
            className={cn(classNames?.button, classNames?.primaryButton)}
          >
            {localization.CONTINUE}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
