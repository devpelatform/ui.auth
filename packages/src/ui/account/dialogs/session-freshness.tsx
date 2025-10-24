'use client';

import { Button } from '@pelatform/ui/default';
import { useAuth } from '../../../hooks/main';
import { useLocalization } from '../../../hooks/private';
import { cn } from '../../../lib/utils';
import type { DialogComponentProps } from '../../../types/ui';
import { DialogComponent } from '../../shared/components/dialog';

export function SessionFreshnessDialog({
  classNames,
  localization: localizationProp,
  onOpenChange,
  title,
  description,
  ...props
}: DialogComponentProps) {
  const { basePath, navigate, viewPaths } = useAuth();

  const localization = useLocalization(localizationProp);

  const handleSignOut = () => {
    navigate(`${basePath}/${viewPaths.SIGN_OUT}`);
    onOpenChange?.(false);
  };

  return (
    <DialogComponent
      classNames={classNames}
      localization={localization}
      onOpenChange={onOpenChange}
      title={title || localization.SESSION_EXPIRED}
      description={description || localization.SESSION_NOT_FRESH}
      cancelButton={true}
      button={
        <Button
          type="submit"
          className={cn(classNames?.button, classNames?.primaryButton)}
          onClick={handleSignOut}
        >
          {localization.SIGN_OUT}
        </Button>
      }
      {...props}
    />
  );
}
