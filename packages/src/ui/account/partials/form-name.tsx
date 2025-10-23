'use client';

import { useAuth, useAuthHooks } from '../../../hooks/index';
import { useLocalization } from '../../../hooks/private';
import type { CardComponentProps } from '../../../types/ui';
import { FormFieldsCard } from './form-fields';

export function FormNameCard({
  className,
  classNames,
  localization: localizationProp,
  ...props
}: CardComponentProps) {
  const { nameRequired } = useAuth();
  const { useSession } = useAuthHooks();
  const { data: sessionData } = useSession();

  const localization = useLocalization(localizationProp);

  return (
    <FormFieldsCard
      className={className}
      classNames={classNames}
      description={localization.NAME_DESCRIPTION}
      instructions={localization.NAME_INSTRUCTIONS}
      localization={localization}
      name="name"
      placeholder={localization.NAME_PLACEHOLDER}
      required={nameRequired}
      label={localization.NAME}
      value={sessionData?.user.name}
      {...props}
    />
  );
}
