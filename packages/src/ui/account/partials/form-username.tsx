'use client';

import { useAuthHooks } from '@/hooks';
import { useLocalization } from '@/hooks/private';
import type { User } from '@/types/auth';
import type { CardComponentProps } from '@/types/ui';
import { FormFieldsCard } from './form-fields';

export function FormUsernameCard({
  className,
  classNames,
  localization: localizationProp,
  ...props
}: CardComponentProps) {
  const { useSession } = useAuthHooks();
  const { data: sessionData } = useSession();

  const localization = useLocalization(localizationProp);

  const value =
    (sessionData?.user as User)?.displayUsername || (sessionData?.user as User)?.username;

  return (
    <FormFieldsCard
      className={className}
      classNames={classNames}
      description={localization.USERNAME_DESCRIPTION}
      instructions={localization.USERNAME_INSTRUCTIONS}
      localization={localization}
      name="username"
      placeholder={localization.USERNAME_PLACEHOLDER}
      required
      label={localization.USERNAME}
      value={value}
      {...props}
    />
  );
}
