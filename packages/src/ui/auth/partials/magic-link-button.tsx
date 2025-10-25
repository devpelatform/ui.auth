'use client';

import { LockIcon, MailIcon } from 'lucide-react';

import { Button } from '@pelatform/ui/default';
import { useAuth } from '../../../hooks/main';
import { useLocalization } from '../../../hooks/private';
import { cn } from '../../../lib/utils';
import type { AuthButtonProps } from '../types';
import { LastUsedButton } from './last-used-button';

export function MagicLinkButton({
  className,
  classNames,
  isSubmitting,
  localization: localizationProp,
  view,
}: AuthButtonProps) {
  const { basePath, credentials, navigate, viewPaths } = useAuth();

  const localization = useLocalization(localizationProp);

  return (
    <Button
      type="button"
      variant="secondary"
      className={cn(
        'relative w-full',
        className,
        classNames?.form?.button,
        classNames?.form?.secondaryButton,
      )}
      onClick={() =>
        navigate(
          `${basePath}/${view === 'MAGIC_LINK' || !credentials ? viewPaths.SIGN_IN : viewPaths.MAGIC_LINK}${window.location.search}`,
        )
      }
      disabled={isSubmitting}
    >
      <LastUsedButton
        className={classNames?.form?.lastLoginMethod}
        localization={localization}
        lastUsedName="magic-link"
      />
      {view === 'MAGIC_LINK' ? (
        <LockIcon className={classNames?.form?.icon} />
      ) : (
        <MailIcon className={classNames?.form?.icon} />
      )}
      {localization.SIGN_IN_WITH}{' '}
      {view === 'MAGIC_LINK' ? localization.PASSWORD : localization.MAGIC_LINK}
    </Button>
  );
}
