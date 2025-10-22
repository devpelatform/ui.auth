'use client';

import { useState } from 'react';

import { useAuthHooks } from '@/hooks';
import { useLocalization } from '@/hooks/private';
import type { User } from '@/types/auth';
import type { CardComponentProps } from '@/types/ui';
import { CardComponent } from '../../shared/components/card';
import { TwoFactorPasswordDialog } from '../dialogs/two-factor-password';

export function TwoFactorCard({
  className,
  classNames,
  localization: localizationProp,
  ...props
}: CardComponentProps) {
  const { useSession } = useAuthHooks();
  const { data: sessionData, isPending } = useSession();

  const localization = useLocalization(localizationProp);

  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const isTwoFactorEnabled = (sessionData?.user as User)?.twoFactorEnabled;

  return (
    <>
      <CardComponent
        className={className}
        classNames={classNames}
        title={localization.TWO_FACTOR}
        description={localization.TWO_FACTOR_CARD_DESCRIPTION}
        instructions={
          isTwoFactorEnabled
            ? localization.TWO_FACTOR_DISABLE_INSTRUCTIONS
            : localization.TWO_FACTOR_ENABLE_INSTRUCTIONS
        }
        actionLabel={
          isTwoFactorEnabled ? localization.DISABLE_TWO_FACTOR : localization.ENABLE_TWO_FACTOR
        }
        action={() => setShowPasswordDialog(true)}
        isPending={isPending}
        {...props}
      />

      <TwoFactorPasswordDialog
        classNames={classNames}
        localization={localization}
        open={showPasswordDialog}
        onOpenChange={setShowPasswordDialog}
        isTwoFactorEnabled={!!isTwoFactorEnabled}
      />
    </>
  );
}
