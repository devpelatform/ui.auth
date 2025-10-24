'use client';

import { useState } from 'react';

import { Button, Card, Spinner } from '@pelatform/ui/default';
import { useAuth } from '../../../hooks/main';
import { useLocalization } from '../../../hooks/private';
import { useListOrganizations } from '../../../hooks/use-list-organizations';
import { cn, getLocalizedError } from '../../../lib/utils';
import type { Organization } from '../../../types/auth';
import type { DialogComponentProps } from '../../../types/ui';
import { DialogComponent } from '../../shared/components/dialog';
import { OrgView } from '../../shared/view';

export function LeaveOrganizationDialog({
  classNames,
  localization: localizationProp,
  onOpenChange,
  title,
  description,
  organization,
  ...props
}: DialogComponentProps & { organization: Organization | null | undefined }) {
  const { authClient, toast } = useAuth();
  const { refetch: refetchOrganizations } = useListOrganizations();

  const localization = useLocalization(localizationProp);

  const [isLeaving, setIsLeaving] = useState(false);

  const handleLeaveOrganization = async () => {
    setIsLeaving(true);

    try {
      await authClient.organization.leave({
        organizationId: organization?.id as string,
        fetchOptions: { throw: true },
      });

      await refetchOrganizations?.();

      toast({
        message: localization.LEAVE_ORGANIZATION_SUCCESS,
        icon: 'success',
      });

      onOpenChange?.(false);
    } catch (error) {
      toast({
        message: getLocalizedError({ error, localization }),
      });
    }

    setIsLeaving(false);
  };

  return (
    <DialogComponent
      classNames={classNames}
      localization={localization}
      onOpenChange={onOpenChange}
      title={title || localization.LEAVE_ORGANIZATION}
      description={description || localization.LEAVE_ORGANIZATION_CONFIRM}
      cancelButton={true}
      cancelButtonDisabled={isLeaving}
      button={
        <Button
          type="button"
          variant="destructive"
          className={cn(classNames?.button, classNames?.destructiveButton)}
          onClick={handleLeaveOrganization}
          disabled={isLeaving}
        >
          {isLeaving && <Spinner />}
          {localization.LEAVE_ORGANIZATION}
        </Button>
      }
      {...props}
    >
      <Card className={cn('flex-row p-4', classNames?.cell)}>
        <OrgView localization={localization} organization={organization} />
      </Card>
    </DialogComponent>
  );
}
