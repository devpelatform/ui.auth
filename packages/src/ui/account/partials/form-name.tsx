'use client';

import { useAuth } from '../../../hooks/main';
import { useLocalization } from '../../../hooks/private';
import { useSession } from '../../../hooks/use-session';
import type { CardComponentProps } from '../../../types/ui';
import { FormFieldsCard } from './form-fields';

export function FormNameCard({
  className,
  classNames,
  localization: localizationProp,
  ...props
}: CardComponentProps) {
  const { nameRequired } = useAuth();
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
