'use client';

import { type ComponentProps, useMemo, useState } from 'react';
import { FingerprintIcon, Loader2 } from 'lucide-react';

import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Form,
} from '@pelatform/ui/default';
import { useForm } from '@pelatform/ui/re/react-hook-form';
import { useAuth, useAuthHooks } from '@/hooks';
import type { AuthLocalization } from '@/lib/localization';
import { cn, getLocalizedError } from '@/lib/utils';
import { SettingsCard, type SettingsCardClassNames } from '../../shared/settings-card';

export interface PasskeysCardProps {
  className?: string;
  classNames?: SettingsCardClassNames;
  localization?: AuthLocalization;
}

export function PasskeysCard({
  className,
  classNames,
  localization: localizationProp,
}: PasskeysCardProps) {
  const { authClient, freshAge, localization: localizationContext, toast } = useAuth();
  const { useListPasskeys, useSession } = useAuthHooks();
  const { data: passkeys, isPending, refetch } = useListPasskeys();
  const { data: sessionData } = useSession();

  const localization = useMemo(
    () => ({ ...localizationContext, ...localizationProp }),
    [localizationContext, localizationProp],
  );

  const session = sessionData?.session;
  const isFresh = session
    ? Date.now() - new Date(session?.createdAt).getTime() < freshAge * 1000
    : false;

  const [showFreshnessDialog, setShowFreshnessDialog] = useState(false);

  const addPasskey = async () => {
    // If session isn't fresh, show the freshness dialog
    if (!isFresh) {
      setShowFreshnessDialog(true);
      return;
    }

    try {
      await authClient.passkey.addPasskey({
        fetchOptions: { throw: true },
      });
      await refetch?.();
    } catch (error) {
      toast({
        message: getLocalizedError({ error, localization }),
      });
    }
  };

  const form = useForm();

  return (
    <>
      <SessionFreshnessDialog
        open={showFreshnessDialog}
        onOpenChange={setShowFreshnessDialog}
        classNames={classNames}
        localization={localization}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(addPasskey)}>
          <SettingsCard
            className={className}
            classNames={classNames}
            actionLabel={localization.ADD_PASSKEY}
            description={localization.PASSKEYS_DESCRIPTION}
            instructions={localization.PASSKEYS_INSTRUCTIONS}
            isPending={isPending}
            title={localization.PASSKEYS}
          >
            {passkeys && passkeys.length > 0 && (
              <CardContent className={cn('grid gap-4', classNames?.content)}>
                {passkeys?.map((passkey) => (
                  <PasskeyCell
                    key={passkey.id}
                    classNames={classNames}
                    localization={localization}
                    passkey={passkey}
                  />
                ))}
              </CardContent>
            )}
          </SettingsCard>
        </form>
      </Form>
    </>
  );
}

interface PasskeyCellProps {
  className?: string;
  classNames?: SettingsCardClassNames;
  localization: AuthLocalization;
  passkey: { id: string; createdAt: Date };
}

function PasskeyCell({ className, classNames, localization, passkey }: PasskeyCellProps) {
  const { freshAge, toast } = useAuth();
  const { useSession, useListPasskeys, useDeletePasskey } = useAuthHooks();
  const { refetch } = useListPasskeys();
  const { data: sessionData } = useSession();
  const { mutate: deletePasskey } = useDeletePasskey();

  const session = sessionData?.session;
  const isFresh = session
    ? Date.now() - new Date(session?.createdAt).getTime() < freshAge * 1000
    : false;

  const [showFreshnessDialog, setShowFreshnessDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDeletePasskey = async () => {
    // If session isn't fresh, show the freshness dialog
    if (!isFresh) {
      setShowFreshnessDialog(true);
      return;
    }

    setIsLoading(true);

    try {
      await deletePasskey({ id: passkey.id });
      refetch?.();
    } catch (error) {
      setIsLoading(false);

      toast({
        message: getLocalizedError({ error, localization }),
      });
    }
  };

  return (
    <>
      <SessionFreshnessDialog
        open={showFreshnessDialog}
        onOpenChange={setShowFreshnessDialog}
        classNames={classNames}
        localization={localization}
      />

      <Card className={cn('flex-row items-center p-4', className, classNames?.cell)}>
        <div className="flex items-center gap-3">
          <FingerprintIcon className={cn('size-4', classNames?.icon)} />
          <span className="text-sm">{new Date(passkey.createdAt).toLocaleString()}</span>
        </div>

        <Button
          className={cn('relative ms-auto', classNames?.button, classNames?.outlineButton)}
          disabled={isLoading}
          size="sm"
          variant="outline"
          onClick={handleDeletePasskey}
        >
          {isLoading && <Loader2 className="animate-spin" />}

          {localization.DELETE}
        </Button>
      </Card>
    </>
  );
}

export interface SessionFreshnessDialogProps extends ComponentProps<typeof Dialog> {
  classNames?: SettingsCardClassNames;
  localization?: AuthLocalization;
  title?: string;
  description?: string;
}

export function SessionFreshnessDialog({
  classNames,
  localization: localizationProp,
  title,
  description,
  onOpenChange,
  ...props
}: SessionFreshnessDialogProps) {
  const { basePath, localization: localizationContext, navigate, viewPaths } = useAuth();

  const localization = useMemo(
    () => ({ ...localizationContext, ...localizationProp }),
    [localizationContext, localizationProp],
  );

  const handleSignOut = () => {
    navigate(`${basePath}/${viewPaths.SIGN_OUT}`);
    onOpenChange?.(false);
  };

  return (
    <Dialog onOpenChange={onOpenChange} {...props}>
      <DialogContent className={cn('sm:max-w-md', classNames?.dialog?.content)}>
        <DialogHeader className={classNames?.dialog?.header}>
          <DialogTitle className={cn('text-lg md:text-xl', classNames?.title)}>
            {title || localization?.SESSION_EXPIRED || 'Session Expired'}
          </DialogTitle>

          <DialogDescription className={cn('text-xs md:text-sm', classNames?.description)}>
            {description || localization?.SESSION_NOT_FRESH}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className={classNames?.dialog?.footer}>
          <Button
            type="button"
            variant="secondary"
            className={cn(classNames?.button, classNames?.secondaryButton)}
            onClick={() => onOpenChange?.(false)}
          >
            {localization.CANCEL}
          </Button>

          <Button
            className={cn(classNames?.button, classNames?.primaryButton)}
            onClick={handleSignOut}
          >
            {localization?.SIGN_OUT}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
