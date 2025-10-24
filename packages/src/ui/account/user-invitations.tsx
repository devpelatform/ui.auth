'use client';

import { useState } from 'react';
import { CheckIcon, EllipsisIcon, XIcon } from 'lucide-react';

import {
  Button,
  Card,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Spinner,
} from '@pelatform/ui/default';
import { useAuth, useOrganization } from '../../hooks/main';
import { useLocalization } from '../../hooks/private';
import { useListOrganizations } from '../../hooks/use-list-organizations';
import { useListUserInvitations } from '../../hooks/use-list-user-invitations';
import { cn, getLocalizedError } from '../../lib/utils';
import { UserAvatar } from '../shared/avatar';
import { CardComponent } from '../shared/components/card';
import type { AccountBaseProps } from './types';

export function UserInvitationsCard({
  className,
  classNames,
  localization: localizationProp,
  ...props
}: AccountBaseProps) {
  const { data: invitations, refetch: refetchInvitations } = useListUserInvitations();
  const { refetch: refetchOrganizations } = useListOrganizations();

  const localization = useLocalization(localizationProp);

  const handleRefresh = async () => {
    await refetchInvitations?.();
    await refetchOrganizations?.();
  };

  const pendingInvitations = invitations?.filter((invitation) => invitation.status === 'pending');

  if (!pendingInvitations?.length) return null;

  return (
    <CardComponent
      className={className}
      classNames={classNames}
      title={localization.PENDING_INVITATIONS}
      description={
        localization.PENDING_USER_INVITATIONS_DESCRIPTION ||
        localization.PENDING_INVITATIONS_DESCRIPTION
      }
      {...props}
    >
      <div className={cn('grid gap-4', classNames?.grid)}>
        {pendingInvitations.map((invitation) => (
          <UserInvitationCell
            key={invitation.id}
            classNames={classNames}
            localization={localization}
            onChanged={handleRefresh}
            invitation={{
              id: invitation.id,
              email: invitation.email,
              role: invitation.role,
              status: invitation.status,
              expiresAt: invitation.expiresAt,
            }}
          />
        ))}
      </div>
    </CardComponent>
  );
}

function UserInvitationCell({
  classNames,
  localization,
  onChanged,
  invitation,
}: AccountBaseProps & {
  invitation: {
    id: string;
    email: string;
    role: string;
    status: string;
    expiresAt: Date;
  };
  onChanged?: () => unknown;
}) {
  const { authClient, toast } = useAuth();
  const { roles } = useOrganization();

  const role = roles.find((r) => r.role === invitation.role);

  const [isLoading, setIsLoading] = useState(false);

  const handleAccept = async () => {
    setIsLoading(true);

    try {
      await authClient.organization.acceptInvitation({
        invitationId: invitation.id,
        fetchOptions: { throw: true },
      });

      await onChanged?.();

      toast({
        message: localization?.INVITATION_ACCEPTED,
        icon: 'success',
      });
    } catch (error) {
      toast({
        message: getLocalizedError({ error, localization }),
      });
    }

    setIsLoading(false);
  };

  const handleReject = async () => {
    setIsLoading(true);

    try {
      await authClient.organization.rejectInvitation({
        invitationId: invitation.id,
        fetchOptions: { throw: true },
      });

      await onChanged?.();

      toast({
        message: localization?.INVITATION_REJECTED,
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
    <Card className={cn('flex-row items-center p-4', classNames?.cell)}>
      <div className="flex flex-1 items-center gap-2">
        <UserAvatar
          className="my-0.5"
          classNames={classNames?.avatar}
          localization={localization}
          user={{ email: invitation.email }}
        />

        <div className="grid flex-1 text-start leading-tight">
          <span className="truncate font-semibold text-sm">{invitation.email}</span>
          <span className="truncate text-muted-foreground text-xs">
            {localization?.EXPIRES} {invitation.expiresAt.toLocaleDateString()}
          </span>
        </div>
      </div>

      <span className="me-2 truncate font-semibold text-sm opacity-80">{role?.label}</span>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              size="icon"
              variant="outline"
              className={cn('relative ms-auto', classNames?.button, classNames?.outlineButton)}
              disabled={isLoading}
            >
              {isLoading ? <Spinner /> : <EllipsisIcon className={classNames?.icon} />}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent onCloseAutoFocus={(e) => e.preventDefault()}>
            <DropdownMenuItem onClick={handleAccept} disabled={isLoading}>
              <CheckIcon className={classNames?.icon} />
              {localization?.ACCEPT}
            </DropdownMenuItem>

            <DropdownMenuItem variant="destructive" onClick={handleReject} disabled={isLoading}>
              <XIcon className={classNames?.icon} />
              {localization?.REJECT}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
}
