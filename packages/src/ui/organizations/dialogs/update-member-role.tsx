'use client';

import { useState } from 'react';

import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Spinner,
} from '@pelatform/ui/default';
import { useAuth, useOrganization } from '../../../hooks/main';
import { useLocalization } from '../../../hooks/private';
import { useListMembers } from '../../../hooks/use-list-members';
import { useSession } from '../../../hooks/use-session';
import { cn, getLocalizedError } from '../../../lib/utils';
import type { Member, User } from '../../../types/auth';
import type { DialogComponentProps } from '../../../types/ui';
import { DialogComponent } from '../../shared/components/dialog';
import { OrganizationMemberCell } from '../partials/member';

export function UpdateMemberRoleDialog({
  classNames,
  localization: localizationProp,
  onOpenChange,
  title,
  description,
  member,
  ...props
}: DialogComponentProps & { member: Member & { user?: Partial<User> | null } }) {
  const { authClient, toast } = useAuth();
  const { roles } = useOrganization();
  const { data: sessionData } = useSession();
  const { data: listMembers, refetch: refetchListMembers } = useListMembers({
    query: { organizationId: member.organizationId },
  });

  const localization = useLocalization(localizationProp);

  const members = listMembers?.members;

  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedRole, setSelectedRole] = useState(member.role);

  const currentUserRole = members?.find((m) => m.user?.id === sessionData?.user.id)?.role;

  const availableRoles = roles.filter((role) => {
    if (role.role === 'owner') {
      return currentUserRole === 'owner';
    }

    if (role.role === 'admin') {
      return currentUserRole === 'owner' || currentUserRole === 'admin';
    }

    return true;
  });

  const updateMemberRole = async () => {
    if (selectedRole === member.role) {
      toast({
        message: `${localization.ROLE} ${localization.IS_THE_SAME}`,
      });

      return;
    }

    setIsUpdating(true);

    try {
      await authClient.organization.updateMemberRole({
        memberId: member.id,
        role: selectedRole,
        organizationId: member.organizationId,
        fetchOptions: {
          throw: true,
        },
      });

      toast({
        message: localization.MEMBER_ROLE_UPDATED,
        icon: 'success',
      });

      await refetchListMembers?.();

      onOpenChange?.(false);
    } catch (error) {
      toast({
        message: getLocalizedError({ error, localization }),
      });
    }

    setIsUpdating(false);
  };

  return (
    <DialogComponent
      classNames={classNames}
      localization={localization}
      onOpenChange={onOpenChange}
      title={title || localization.UPDATE_ROLE}
      description={description || localization.UPDATE_ROLE_DESCRIPTION}
      cancelButton={true}
      cancelButtonDisabled={isUpdating}
      button={
        <Button
          type="button"
          className={cn(classNames?.button, classNames?.destructiveButton)}
          onClick={updateMemberRole}
          disabled={isUpdating}
        >
          {isUpdating && <Spinner />}
          {localization.UPDATE_ROLE}
        </Button>
      }
      {...props}
    >
      <div className="grid gap-4">
        <OrganizationMemberCell
          className={classNames?.cell}
          localization={localization}
          member={member}
          hideActions
        />
        <Select value={selectedRole} onValueChange={setSelectedRole}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={localization.SELECT_ROLE} />
          </SelectTrigger>

          <SelectContent>
            {availableRoles.map((role) => (
              <SelectItem key={role.role} value={role.role}>
                {role.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </DialogComponent>
  );
}
