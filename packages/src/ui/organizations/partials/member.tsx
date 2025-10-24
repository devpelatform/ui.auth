'use client';

import { useState } from 'react';
import { EllipsisIcon, UserCogIcon, UserXIcon } from 'lucide-react';

import {
  Button,
  Card,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@pelatform/ui/default';
import { useOrganization } from '../../../hooks/main';
import { useLocalization } from '../../../hooks/private';
import { useHasPermission } from '../../../hooks/use-has-permission';
import { useListMembers } from '../../../hooks/use-list-members';
import { useListOrganizations } from '../../../hooks/use-list-organizations';
import { useSession } from '../../../hooks/use-session';
import { cn } from '../../../lib/utils';
import type { Member, Organization, User } from '../../../types/auth';
import type { CardComponentProps } from '../../../types/ui';
import { CardComponent } from '../../shared/components/card';
import { SkeletonViewComponent } from '../../shared/components/skeleton';
import { UserView } from '../../shared/view';
import { InviteMemberDialog } from '../dialogs/invite-member';
import { LeaveOrganizationDialog } from '../dialogs/leave-organization';
import { RemoveMemberDialog } from '../dialogs/remove-member';
import { UpdateMemberRoleDialog } from '../dialogs/update-member-role';

export function OrganizationMemberCard({
  className,
  classNames,
  localization: localizationProp,
  ...props
}: CardComponentProps) {
  const { data: organization, isPending: organizationPending } = useOrganization();
  const { data: listMembers, isPending: membersPending } = useListMembers({
    query: { organizationId: organization?.id },
  });
  const { data: permissionInvite, isPending: pendingInvite } = useHasPermission({
    organizationId: organization?.id,
    permissions: {
      invitation: ['create'],
    },
  });
  const { data: permissionUpdateMember, isPending: pendingUpdateMember } = useHasPermission({
    organizationId: organization?.id,
    permission: {
      member: ['update'],
    },
  });

  const localization = useLocalization(localizationProp);

  const isPending =
    organizationPending || !organization || membersPending || pendingInvite || pendingUpdateMember;

  const members = listMembers?.members;

  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

  return (
    <>
      <CardComponent
        className={className}
        classNames={classNames}
        title={localization.MEMBERS}
        description={localization.MEMBERS_DESCRIPTION}
        instructions={localization.MEMBERS_INSTRUCTIONS}
        actionLabel={localization.INVITE_MEMBER}
        action={() => setInviteDialogOpen(true)}
        isPending={isPending}
        disabled={!permissionInvite?.success}
        {...props}
      >
        {isPending ? (
          <div className={cn('grid gap-4', classNames?.grid)}>
            <SkeletonViewComponent classNames={classNames} />
          </div>
        ) : (
          members &&
          members.length > 0 && (
            <div className={cn('grid gap-4', classNames?.grid)}>
              {members
                .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                .map((member) => (
                  <OrganizationMemberCell
                    key={member.id}
                    classNames={classNames}
                    member={member}
                    localization={localization}
                    hideActions={!permissionUpdateMember?.success}
                  />
                ))}
            </div>
          )
        )}
      </CardComponent>

      <InviteMemberDialog
        classNames={classNames}
        localization={localization}
        open={inviteDialogOpen}
        onOpenChange={setInviteDialogOpen}
        organization={organization as Organization}
      />
    </>
  );
}

export function OrganizationMemberCell({
  className,
  classNames,
  localization: localizationProp,
  member,
  hideActions,
}: CardComponentProps & {
  member: Member & { user?: Partial<User> | null };
  hideActions?: boolean;
}) {
  const { roles } = useOrganization();
  const { data: sessionData } = useSession();
  const { data: listMembers } = useListMembers({
    query: { organizationId: member.organizationId },
  });
  const { data: organizations } = useListOrganizations();
  const organization = organizations?.find((org) => org.id === member.organizationId);
  const { data: permissionToUpdateMember } = useHasPermission({
    organizationId: member.organizationId,
    permission: { member: ['update'] },
  });

  const localization = useLocalization(localizationProp);

  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
  const [updateRoleDialogOpen, setUpdateRoleDialogOpen] = useState(false);

  const members = listMembers?.members;
  const isSelf = sessionData?.user.id === member?.userId;

  const myRole = members?.find((m) => m.user?.id === sessionData?.user.id)?.role;
  const role = roles.find((r) => r.role === member.role);

  return (
    <>
      <Card className={cn('flex-row items-center p-4', className, classNames?.cell)}>
        <UserView className="flex-1" localization={localization} user={member.user} />

        <span className={cn('font-semibold text-xs opacity-80', !hideActions && 'me-2')}>
          {role?.label}
        </span>

        {!hideActions && (isSelf || member.role !== 'owner' || myRole === 'owner') && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className={cn('relative ms-auto', classNames?.button, classNames?.outlineButton)}
              >
                <EllipsisIcon className={classNames?.icon} />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" onCloseAutoFocus={(e) => e.preventDefault()}>
              {permissionToUpdateMember?.success && (
                <DropdownMenuItem onClick={() => setUpdateRoleDialogOpen(true)}>
                  <UserCogIcon className={classNames?.icon} />
                  {localization?.UPDATE_ROLE}
                </DropdownMenuItem>
              )}

              <DropdownMenuItem
                variant="destructive"
                onClick={() => (isSelf ? setLeaveDialogOpen(true) : setRemoveDialogOpen(true))}
              >
                <UserXIcon className={classNames?.icon} />
                {isSelf ? localization?.LEAVE_ORGANIZATION : localization?.REMOVE_MEMBER}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </Card>

      <RemoveMemberDialog
        classNames={classNames}
        localization={localization}
        open={removeDialogOpen}
        onOpenChange={setRemoveDialogOpen}
        member={member}
      />

      <UpdateMemberRoleDialog
        classNames={classNames}
        localization={localization}
        open={updateRoleDialogOpen}
        onOpenChange={setUpdateRoleDialogOpen}
        member={member}
      />

      {organization && (
        <LeaveOrganizationDialog
          classNames={classNames}
          localization={localization}
          open={leaveDialogOpen}
          onOpenChange={setLeaveDialogOpen}
          organization={organization}
        />
      )}
    </>
  );
}
