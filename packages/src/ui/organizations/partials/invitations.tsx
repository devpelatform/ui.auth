'use client';

import { useState } from 'react';
import { EllipsisIcon, XIcon } from 'lucide-react';

import {
  Button,
  Card,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Spinner,
} from '@pelatform/ui/default';
import { useAuth, useAuthHooks, useOrganization } from '../../../hooks/index';
import { useLocalization } from '../../../hooks/private';
import { cn, getLocalizedError } from '../../../lib/utils';
import type { Organization } from '../../../types/auth';
import type { Invitation } from '../../../types/generals';
import type { CardComponentProps } from '../../../types/ui';
import { UserAvatar } from '../../shared/avatar';
import { CardComponent } from '../../shared/components/card';
import { SkeletonViewComponent } from '../../shared/components/skeleton';

export function OrganizationInvitationsCard({
  className,
  classNames,
  localization: localizationProp,
  ...props
}: CardComponentProps) {
  const { data: organization, isPending: organizationPending } = useOrganization();
  const { data: invitations, isPending: invitationsPending } = useAuthHooks().useListInvitations({
    query: { organizationId: organization?.id },
  });

  const localization = useLocalization(localizationProp);

  const isPending = invitationsPending || organizationPending || !organization;

  const pendingInvitations = invitations?.filter((invitation) => invitation.status === 'pending');

  return (
    <CardComponent
      className={className}
      classNames={classNames}
      title={localization.PENDING_INVITATIONS}
      description={localization.PENDING_INVITATIONS_DESCRIPTION}
      isPending={isPending}
      {...props}
    >
      {isPending ? (
        <div className={cn('grid gap-4', classNames?.grid)}>
          <SkeletonViewComponent classNames={classNames} />
        </div>
      ) : (
        pendingInvitations &&
        pendingInvitations.length > 0 && (
          <div className={cn('grid gap-4', classNames?.grid)}>
            {pendingInvitations.map((invitation) => (
              <OrganizationInvitationsCell
                key={invitation.id}
                classNames={classNames}
                invitation={invitation}
                localization={localization}
                organization={organization}
              />
            ))}
          </div>
        )
      )}
    </CardComponent>
  );
}

function OrganizationInvitationsCell({
  className,
  classNames,
  localization,
  invitation,
  organization,
}: CardComponentProps & {
  invitation: Invitation;
  organization: Organization | null | undefined;
}) {
  const { authClient, toast } = useAuth();
  const { customRoles } = useOrganization();
  const { refetch: refetchInvitations } = useAuthHooks().useListInvitations({
    query: { organizationId: organization?.id },
  });

  const [isLoading, setIsLoading] = useState(false);

  const builtInRoles = [
    { role: 'owner', label: localization?.OWNER },
    { role: 'admin', label: localization?.ADMIN },
    { role: 'member', label: localization?.MEMBER },
  ];

  const roles = [...builtInRoles, ...(customRoles || [])];
  const role = roles.find((r) => r.role === invitation.role);

  const handleCancelInvitation = async () => {
    setIsLoading(true);

    try {
      await authClient.organization.cancelInvitation({
        invitationId: invitation.id,
        fetchOptions: { throw: true },
      });

      await refetchInvitations?.();

      toast({
        message: localization?.INVITATION_CANCELLED,
        icon: 'success',
      });
    } catch (error) {
      toast({
        message: getLocalizedError({ error, localization }),
      });
    }

    setIsLoading(false);
  };

  return (
    <Card className={cn('flex-row items-center p-4', className, classNames?.cell)}>
      <div className="flex flex-1 items-center gap-2">
        <UserAvatar className="my-0.5" localization={localization} user={invitation} />

        <div className="grid flex-1 text-start leading-tight">
          <span className="truncate font-semibold text-sm">{invitation.email}</span>

          <span className="truncate text-muted-foreground text-xs">
            {localization?.EXPIRES} {invitation.expiresAt.toLocaleDateString()}
          </span>
        </div>
      </div>

      <span className="truncate text-sm opacity-70">{role?.label}</span>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className={cn('relative ms-auto', classNames?.button, classNames?.outlineButton)}
            disabled={isLoading}
          >
            {isLoading ? <Spinner /> : <EllipsisIcon className={classNames?.icon} />}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" onCloseAutoFocus={(e) => e.preventDefault()}>
          <DropdownMenuItem
            variant="destructive"
            onClick={handleCancelInvitation}
            disabled={isLoading}
          >
            <XIcon className={classNames?.icon} />
            {localization?.CANCEL_INVITATION}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Card>
  );
}
