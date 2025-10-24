'use client';

import { useState } from 'react';
import { FingerprintIcon } from 'lucide-react';

import { Button, Card, Form, Spinner } from '@pelatform/ui/default';
import { useForm } from '@pelatform/ui/re/react-hook-form';
import { useAuth } from '../../../hooks/main';
import { useLocalization } from '../../../hooks/private';
import { useDeletePasskey } from '../../../hooks/use-delete-passkey';
import { useListPasskeys } from '../../../hooks/use-list-passkeys';
import { useSession } from '../../../hooks/use-session';
import { cn, getLocalizedError } from '../../../lib/utils';
import type { CardComponentProps } from '../../../types/ui';
import { CardComponent } from '../../shared/components/card';
import { SkeletonViewComponent } from '../../shared/components/skeleton';
import { SessionFreshnessDialog } from '../dialogs/session-freshness';

export function PasskeysCard({
  className,
  classNames,
  localization: localizationProp,
  ...props
}: CardComponentProps) {
  const { authClient, freshAge, toast } = useAuth();
  const { data: sessionData, isPending: sessionPending } = useSession();
  const { data: passkeys, isPending: passkeysPending, refetch } = useListPasskeys();

  const localization = useLocalization(localizationProp);

  const isPending = sessionPending || passkeysPending;

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
        classNames={classNames}
        localization={localization}
        open={showFreshnessDialog}
        onOpenChange={setShowFreshnessDialog}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(addPasskey)}>
          <CardComponent
            className={className}
            classNames={classNames}
            title={localization.PASSKEYS}
            description={localization.PASSKEYS_DESCRIPTION}
            instructions={localization.PASSKEYS_INSTRUCTIONS}
            actionLabel={localization.ADD_PASSKEY}
            isPending={isPending}
            {...props}
          >
            {isPending ? (
              <div className={cn('grid gap-4', classNames?.grid)}>
                <SkeletonViewComponent classNames={classNames} />
              </div>
            ) : (
              passkeys &&
              passkeys.length > 0 && (
                <div className={cn('grid gap-4', classNames?.grid)}>
                  {passkeys?.map((passkey) => (
                    <PasskeyCell
                      key={passkey.id}
                      classNames={classNames}
                      localization={localization}
                      passkey={passkey}
                    />
                  ))}
                </div>
              )
            )}
          </CardComponent>
        </form>
      </Form>
    </>
  );
}

function PasskeyCell({
  className,
  classNames,
  localization,
  passkey,
}: CardComponentProps & {
  passkey: { id: string; createdAt: Date };
}) {
  const { freshAge, toast } = useAuth();
  const { refetch: refetchPasskeys } = useListPasskeys();
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
      refetchPasskeys?.();
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
        classNames={classNames}
        localization={localization}
        open={showFreshnessDialog}
        onOpenChange={setShowFreshnessDialog}
      />

      <Card className={cn('flex-row items-center p-4', className, classNames?.cell)}>
        <div className="flex items-center gap-3">
          <FingerprintIcon className={cn('size-4', classNames?.icon)} />
          <span className="text-sm">{new Date(passkey.createdAt).toLocaleString()}</span>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className={cn('relative ms-auto', classNames?.button, classNames?.outlineButton)}
          onClick={handleDeletePasskey}
          disabled={isLoading}
        >
          {isLoading && <Spinner />}
          {localization?.DELETE}
        </Button>
      </Card>
    </>
  );
}
