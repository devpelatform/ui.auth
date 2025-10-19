'use client';

import { useMemo } from 'react';

import { useAuth, useAuthHooks } from '@/hooks';
import type { User } from '@/types/auth';
import type { SettingsCardProps } from '../../shared/settings-card';
import { FormFieldsCard } from './form-fields';

export function FormUsernameCard({
  className,
  classNames,
  localization: localizationProp,
  ...props
}: SettingsCardProps) {
  const { localization: localizationContext } = useAuth();
  const { useSession } = useAuthHooks();
  const { data: sessionData } = useSession();

  const localization = useMemo(
    () => ({ ...localizationContext, ...localizationProp }),
    [localizationContext, localizationProp],
  );

  const value =
    (sessionData?.user as User)?.displayUsername || (sessionData?.user as User)?.username;

  return (
    <FormFieldsCard
      className={className}
      classNames={classNames}
      value={value}
      description={localization.USERNAME_DESCRIPTION}
      name="username"
      instructions={localization.USERNAME_INSTRUCTIONS}
      label={localization.USERNAME}
      localization={localization}
      placeholder={localization.USERNAME_PLACEHOLDER}
      required
      {...props}
    />
  );
}
