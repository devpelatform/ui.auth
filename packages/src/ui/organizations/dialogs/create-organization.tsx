'use client';

import { useLocalization } from '../../../hooks/private';
import type { DialogComponentProps } from '../../../types/ui';
import { DialogComponent } from '../../shared/components/dialog';
import { CreateOrganizationForm } from '../partials/create-organization-form';

export function CreateOrganizationDialog({
  classNames,
  localization: localizationProp,
  onOpenChange,
  title,
  description,
  disableRedirect = false,
  ...props
}: DialogComponentProps & {
  disableRedirect?: boolean;
}) {
  const localization = useLocalization(localizationProp);

  return (
    <DialogComponent
      classNames={classNames}
      localization={localization}
      onOpenChange={onOpenChange}
      title={title || localization.CREATE_ORGANIZATION}
      description={description || localization.ORGANIZATIONS_INSTRUCTIONS}
      disableFooter={true}
      {...props}
    >
      <CreateOrganizationForm
        classNames={classNames}
        localization={localization}
        dialog={true}
        onOpenChange={onOpenChange}
        disableRedirect={disableRedirect}
      />
    </DialogComponent>
  );
}
