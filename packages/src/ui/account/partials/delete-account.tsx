'use client';

import { useState } from 'react';

import { useAuthHooks } from '@/hooks';
import { useLocalization } from '@/hooks/private';
import type { Account } from '@/types/auth';
import type { CardComponentProps } from '@/types/ui';
import { CardComponent } from '../../shared/components/card';
import { DeleteAccountDialog } from '../dialogs/delete-account';

export function DeleteAccountCard({
  className,
  classNames,
  isPending,
  localization: localizationProp,
  accounts,
  skipHook,
  ...props
}: CardComponentProps & {
  accounts?: Account[] | null;
  skipHook?: boolean;
}) {
  const { useListAccounts } = useAuthHooks();

  const localization = useLocalization(localizationProp);

  const [showDialog, setShowDialog] = useState(false);

  if (!skipHook) {
    const result = useListAccounts();
    accounts = result.data as unknown as Account[];
    isPending = result.isPending;
  }

  return (
    <>
      <CardComponent
        className={className}
        classNames={classNames}
        title={localization.DELETE_ACCOUNT}
        description={localization.DELETE_ACCOUNT_DESCRIPTION}
        actionLabel={localization.DELETE_ACCOUNT}
        action={() => setShowDialog(true)}
        isDestructive={true}
        isPending={isPending}
        {...props}
      />

      <DeleteAccountDialog
        classNames={classNames}
        localization={localization}
        open={showDialog}
        onOpenChange={setShowDialog}
        accounts={accounts}
      />
    </>
  );
}
