'use client';

import { useMemo } from 'react';

import { useAuth, useAuthHooks } from '@/hooks';
import type { SettingsCardProps } from '../../shared/settings-card';
import { FormFieldsCard } from './form-fields';

export function FormNameCard({
  className,
  classNames,
  localization: localizationProp,
  ...props
}: SettingsCardProps) {
  const { localization: localizationContext, nameRequired } = useAuth();
  const { useSession } = useAuthHooks();
  const { data: sessionData } = useSession();

  const localization = useMemo(
    () => ({ ...localizationContext, ...localizationProp }),
    [localizationContext, localizationProp],
  );

  return (
    <FormFieldsCard
      className={className}
      classNames={classNames}
      value={sessionData?.user.name}
      description={localization.NAME_DESCRIPTION}
      name="name"
      instructions={localization.NAME_INSTRUCTIONS}
      label={localization.NAME}
      localization={localization}
      placeholder={localization.NAME_PLACEHOLDER}
      required={nameRequired}
      {...props}
    />
  );
}
