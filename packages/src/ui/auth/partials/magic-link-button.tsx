'use client';

import { useMemo } from 'react';
import { LockIcon, MailIcon } from 'lucide-react';

import { Button } from '@pelatform/ui/default';
import { useAuth } from '@/hooks';
import { cn } from '@/lib/utils';
import type { AuthButtonProps } from '../types';

export function MagicLinkButton({
  classNames,
  isSubmitting,
  localization: propLocalization,
  view,
}: AuthButtonProps) {
  const {
    basePath,
    credentials,
    localization: contextLocalization,
    navigate,
    viewPaths,
  } = useAuth();

  const localization = useMemo(
    () => ({ ...contextLocalization, ...propLocalization }),
    [contextLocalization, propLocalization],
  );

  return (
    <Button
      type="button"
      variant="secondary"
      className={cn('w-full', classNames?.form?.button, classNames?.form?.secondaryButton)}
      disabled={isSubmitting}
      onClick={() =>
        navigate(
          `${basePath}/${view === 'MAGIC_LINK' || !credentials ? viewPaths.SIGN_IN : viewPaths.MAGIC_LINK}${window.location.search}`,
        )
      }
    >
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
