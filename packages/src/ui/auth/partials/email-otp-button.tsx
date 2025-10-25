'use client';

import { LockIcon, MailIcon } from 'lucide-react';

import { Button } from '@pelatform/ui/default';
import { useAuth } from '../../../hooks/main';
import { useLocalization } from '../../../hooks/private';
import { cn } from '../../../lib/utils';
import type { AuthButtonProps } from '../types';
import { LastUsedButton } from './last-used-button';

export function EmailOTPButton({
  className,
  classNames,
  isSubmitting,
  localization: localizationProp,
  view,
}: AuthButtonProps) {
  const { basePath, navigate, viewPaths } = useAuth();

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
          `${basePath}/${view === 'EMAIL_OTP' ? viewPaths.SIGN_IN : viewPaths.EMAIL_OTP}${window.location.search}`,
        )
      }
      disabled={isSubmitting}
    >
      <LastUsedButton
        className={classNames?.form?.lastLoginMethod}
        localization={localization}
        lastUsedName="email-otp"
      />
      {view === 'EMAIL_OTP' ? (
        <LockIcon className={classNames?.form?.icon} />
      ) : (
        <MailIcon className={classNames?.form?.icon} />
      )}
      {localization.SIGN_IN_WITH}{' '}
      {view === 'EMAIL_OTP' ? localization.PASSWORD : localization.EMAIL_OTP}
    </Button>
  );
}
