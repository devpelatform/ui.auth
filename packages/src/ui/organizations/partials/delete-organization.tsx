'use client';

import { useState } from 'react';

import { useOrganization } from '../../../hooks/main';
import { useLocalization } from '../../../hooks/private';
import { useHasPermission } from '../../../hooks/use-has-permission';
import type { CardComponentProps } from '../../../types/ui';
import { CardComponent } from '../../shared/components/card';
import { DeleteOrganizationDialog } from '../dialogs/delete-organization';

export function DeleteOrganizationCard({
  className,
  classNames,
  localization: localizationProp,
  redirectTo,
  ...props
}: CardComponentProps & { redirectTo?: string }) {
  const { data: organization, isPending: organizationPending } = useOrganization();
  const { data: hasPermission, isPending: permissionPending } = useHasPermission({
    organizationId: organization?.id,
    permissions: {
      organization: ['delete'],
    },
  });

  const localization = useLocalization(localizationProp);

  const isPending = organizationPending || permissionPending || !organization;

  const [showDialog, setShowDialog] = useState(false);

  if (isPending) {
    return (
      <CardComponent
        className={className}
        classNames={classNames}
        title={localization.DELETE_ORGANIZATION}
        description={localization.DELETE_ORGANIZATION_DESCRIPTION}
        actionLabel={localization.DELETE_ORGANIZATION}
        isDestructive={true}
        isPending={true}
        {...props}
      />
    );
  }

  if (!hasPermission?.success) return null;

  return (
    <>
      <CardComponent
        className={className}
        classNames={classNames}
        title={localization.DELETE_ORGANIZATION}
        description={localization.DELETE_ORGANIZATION_DESCRIPTION}
        actionLabel={localization.DELETE_ORGANIZATION}
        action={() => setShowDialog(true)}
        isDestructive={true}
        isPending={isPending}
        {...props}
      />

      <DeleteOrganizationDialog
        classNames={classNames}
        localization={localization}
        open={showDialog}
        onOpenChange={setShowDialog}
        organization={organization}
        redirectTo={redirectTo}
      />
    </>
  );
}
