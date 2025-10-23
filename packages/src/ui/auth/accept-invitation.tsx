'use client';

import { useEffect, useState } from 'react';
import { CheckIcon, XIcon } from 'lucide-react';

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Skeleton,
  Spinner,
} from '@pelatform/ui/default';
import { useAuth, useAuthHooks, useOrganization } from '../../hooks/index';
import { useLocalization, useOnSuccessTransition } from '../../hooks/private';
import { cn, getLocalizedError, getSearchParam } from '../../lib/utils';
import type { BaseProps, CardClassNames } from '../../types/ui';
import { OrgView } from '../shared/view';

interface AcceptInvitationProps extends BaseProps {
  classNames?: CardClassNames;
}

export function AcceptInvitation({
  className,
  classNames,
  localization: localizationProp,
  redirectTo: redirectToProp,
}: AcceptInvitationProps & { redirectTo?: string }) {
  const { replace, toast } = useAuth();
  const { useSession } = useAuthHooks();
  const { data: sessionData } = useSession();

  const localization = useLocalization(localizationProp);
  const { redirectTo } = useOnSuccessTransition(redirectToProp);

  const [invitationId, setInvitationId] = useState<string | null>(null);

  useEffect(() => {
    const invitationIdParam = getSearchParam('invitationId');

    if (!invitationIdParam) {
      toast({
        message: localization.INVITATION_NOT_FOUND,
      });

      replace(redirectTo);
      return;
    }

    setInvitationId(invitationIdParam);
  }, [localization.INVITATION_NOT_FOUND, toast, replace, redirectTo]);

  if (!sessionData || !invitationId) {
    return (
      <AcceptInvitationSkeleton
        className={className}
        classNames={classNames}
        localization={localization}
      />
    );
  }

  return (
    <AcceptInvitationContent
      className={className}
      classNames={classNames}
      localization={localization}
      invitationId={invitationId}
      redirectTo={redirectTo}
    />
  );
}

function AcceptInvitationContent({
  className,
  classNames,
  localization,
  invitationId,
  redirectTo,
}: AcceptInvitationProps & { invitationId: string; redirectTo: string }) {
  const { authClient, replace, toast } = useAuth();
  const { customRoles } = useOrganization();
  const { useInvitation } = useAuthHooks();
  const { data: invitation, isPending } = useInvitation({
    query: {
      id: invitationId,
    },
  });

  const [isRejecting, setIsRejecting] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const isProcessing = isRejecting || isAccepting;

  useEffect(() => {
    if (isPending || !invitationId) return;

    if (!invitation) {
      toast({
        message: localization?.INVITATION_NOT_FOUND,
      });

      replace(redirectTo);
      return;
    }

    if (invitation.status !== 'pending' || new Date(invitation.expiresAt) < new Date()) {
      toast({
        message:
          new Date(invitation.expiresAt) < new Date()
            ? localization?.INVITATION_EXPIRED
            : localization?.INVITATION_NOT_FOUND,
      });

      replace(redirectTo);
    }
  }, [invitation, isPending, invitationId, localization, toast, replace, redirectTo]);

  const acceptInvitation = async () => {
    setIsAccepting(true);

    try {
      await authClient.organization.acceptInvitation({
        invitationId: invitationId,
        fetchOptions: { throw: true },
      });

      toast({
        message: localization?.INVITATION_ACCEPTED,
        icon: 'success',
      });

      replace(redirectTo);
    } catch (error) {
      toast({
        message: getLocalizedError({ error, localization }),
      });

      setIsAccepting(false);
    }
  };

  const rejectInvitation = async () => {
    setIsRejecting(true);

    try {
      await authClient.organization.rejectInvitation({
        invitationId: invitationId,
        fetchOptions: { throw: true },
      });

      toast({
        message: localization?.INVITATION_REJECTED,
        icon: 'success',
      });

      replace(redirectTo);
    } catch (error) {
      toast({
        message: getLocalizedError({ error, localization }),
      });

      setIsRejecting(false);
    }
  };

  const builtInRoles = [
    { role: 'owner', label: localization?.OWNER },
    { role: 'admin', label: localization?.ADMIN },
    { role: 'member', label: localization?.MEMBER },
  ];

  const roles = [...builtInRoles, ...(customRoles || [])];
  const roleLabel = roles.find((r) => r.role === invitation?.role)?.label || invitation?.role;

  if (!invitation) {
    return (
      <AcceptInvitationSkeleton
        className={className}
        classNames={classNames}
        localization={localization}
      />
    );
  }

  return (
    <Card className={cn('w-full max-w-sm', className, classNames?.base)}>
      <CardHeader className={cn('justify-items-center text-center', classNames?.header)}>
        <CardTitle className={cn('text-lg md:text-xl', classNames?.title)}>
          {localization?.ACCEPT_INVITATION}
        </CardTitle>

        <CardDescription className={cn('text-xs md:text-sm', classNames?.description)}>
          {localization?.ACCEPT_INVITATION_DESCRIPTION}
        </CardDescription>
      </CardHeader>

      <CardContent className={cn('flex flex-col gap-6 truncate', classNames?.content)}>
        <Card className={cn('flex-row items-center p-4')}>
          <OrgView
            localization={localization}
            organization={{
              id: invitation.organizationId,
              name: invitation.organizationName,
              slug: invitation.organizationSlug,
              // logo: invitation.organizationLogo,
              createdAt: new Date(),
            }}
          />

          <p className="ms-auto text-muted-foreground text-sm">{roleLabel}</p>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className={cn(classNames?.button, classNames?.outlineButton)}
            onClick={rejectInvitation}
            disabled={isProcessing}
          >
            {isRejecting ? <Spinner /> : <XIcon />}
            {localization?.REJECT}
          </Button>

          <Button
            className={cn(classNames?.button, classNames?.primaryButton)}
            onClick={acceptInvitation}
            disabled={isProcessing}
          >
            {isAccepting ? <Spinner /> : <CheckIcon />}
            {localization?.ACCEPT}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function AcceptInvitationSkeleton({ className, classNames, localization }: AcceptInvitationProps) {
  return (
    <Card className={cn('w-full max-w-sm', className, classNames?.base)}>
      <CardHeader className={cn('justify-items-center', classNames?.header)}>
        <Skeleton
          className={cn('my-1 h-5 w-full max-w-32 md:h-5.5 md:w-40', classNames?.skeleton)}
        />
        <Skeleton
          className={cn('my-0.5 h-3 w-full max-w-56 md:h-3.5 md:w-64', classNames?.skeleton)}
        />
      </CardHeader>

      <CardContent className={cn('flex flex-col gap-6 truncate', classNames?.content)}>
        <Card className={cn('flex-row items-center p-4')}>
          <OrgView localization={localization} isPending />
          <Skeleton className="mt-0.5 ml-auto h-4 w-full max-w-14 shrink-2" />
        </Card>
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}
