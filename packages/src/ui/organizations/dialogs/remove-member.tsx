'use client';

import { useState } from 'react';

import { Button, Spinner } from '@pelatform/ui/default';
import { useAuth, useAuthHooks } from '../../../hooks/index';
import { useLocalization } from '../../../hooks/private';
import { cn, getLocalizedError } from '../../../lib/utils';
import type { Member, User } from '../../../types/auth';
import type { DialogComponentProps } from '../../../types/ui';
import { DialogComponent } from '../../shared/components/dialog';
import { OrganizationMemberCell } from '../partials/member';

export function RemoveMemberDialog({
  classNames,
  localization: localizationProp,
  onOpenChange,
  title,
  description,
  member,
  ...props
}: DialogComponentProps & { member: Member & { user?: Partial<User> | null } }) {
  const { authClient, toast } = useAuth();
  const { refetch: refetchListMembers } = useAuthHooks().useListMembers({
    query: { organizationId: member.organizationId },
  });

  const localization = useLocalization(localizationProp);

  const [isRemoving, setIsRemoving] = useState(false);

  const removeMember = async () => {
    setIsRemoving(true);

    try {
      await authClient.organization.removeMember({
        memberIdOrEmail: member.id,
        organizationId: member.organizationId,
        fetchOptions: { throw: true },
      });

      toast({
        message: localization.REMOVE_MEMBER_SUCCESS,
        icon: 'success',
      });

      await refetchListMembers?.();

      onOpenChange?.(false);
    } catch (error) {
      toast({
        message: getLocalizedError({ error, localization }),
      });
    }

    setIsRemoving(false);
  };

  return (
    <DialogComponent
      classNames={classNames}
      localization={localization}
      onOpenChange={onOpenChange}
      title={title || localization.REMOVE_MEMBER}
      description={description || localization.REMOVE_MEMBER_CONFIRM}
      cancelButton={true}
      cancelButtonDisabled={isRemoving}
      button={
        <Button
          type="button"
          variant="destructive"
          className={cn(classNames?.button, classNames?.destructiveButton)}
          onClick={removeMember}
          disabled={isRemoving}
        >
          {isRemoving && <Spinner />}
          {localization.REMOVE_MEMBER}
        </Button>
      }
      {...props}
    >
      <OrganizationMemberCell
        className={classNames?.cell}
        localization={localization}
        member={member}
        hideActions
      />
    </DialogComponent>
  );
}
