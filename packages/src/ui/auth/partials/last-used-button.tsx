'use client';

import type { ComponentProps } from 'react';

import { Badge } from '@pelatform/ui/default';
import { useAuth } from '../../../hooks/main';
import { useLocalization } from '../../../hooks/private';
import { cn } from '../../../lib/utils';
import type { AuthButtonProps } from '../types';

export function LastUsedButton({
  className,
  classNames,
  localization: localizationProp,
  lastUsedName,
  size = 'xs',
  variant = 'primary',
}: AuthButtonProps & ComponentProps<typeof Badge> & { lastUsedName: string | undefined }) {
  const { authClient, lastLoginMethod } = useAuth();

  const localization = useLocalization(localizationProp);

  const lastMethod = authClient.getLastUsedLoginMethod();

  return (
    lastLoginMethod &&
    lastMethod === lastUsedName && (
      <Badge
        size={size}
        variant={variant}
        className={cn('-top-2 -end-2 absolute', className, classNames?.form?.lastLoginMethod)}
      >
        {localization.LAST_USED}
      </Badge>
    )
  );
}
