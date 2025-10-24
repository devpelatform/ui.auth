'use client';

import { useEffect, useState } from 'react';
import { CheckIcon, XIcon } from 'lucide-react';

import { Button, Card, CardContent, CardHeader, Skeleton, Spinner } from '@pelatform/ui/default';
import { useAuth, useOrganization } from '../../hooks/main';
import { useLocalization, useOnSuccessTransition } from '../../hooks/private';
import { useInvitation } from '../../hooks/use-invitation';
import { useSession } from '../../hooks/use-session';
import { cn, getLocalizedError, getSearchParam } from '../../lib/utils';
import type { BaseProps, CardClassNames } from '../../types/ui';
import { CardHeaderComponent } from '../shared/components/card';
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
  const { roles } = useOrganization();
  const { data: invitation, isPending } = useInvitation({
    query: {
      id: invitationId,
    },
  });

  const roleLabel = roles.find((r) => r.role === invitation?.role)?.label || invitation?.role;

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
    <Card className={cn('w-full max-w-md overflow-hidden', className, classNames?.base)}>
      <CardHeader className="py-4">
        <CardHeaderComponent
          title={localization?.ACCEPT_INVITATION}
          description={localization?.ACCEPT_INVITATION_DESCRIPTION}
        />
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

          <p className="ms-auto font-semibold text-muted-foreground text-sm">{roleLabel}</p>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="destructive"
            className={cn(classNames?.button, classNames?.destructiveButton)}
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
    <Card className={cn('w-full max-w-md overflow-hidden', className, classNames?.base)}>
      <CardHeader className="py-4">
        <CardHeaderComponent
          className="w-full"
          title={localization?.ACCEPT_INVITATION}
          description={localization?.ACCEPT_INVITATION_DESCRIPTION}
          isPending
        />
      </CardHeader>

      <CardContent className={cn('flex flex-col gap-6 truncate', classNames?.content)}>
        <Card className={cn('flex-row items-center p-4')}>
          <OrgView localization={localization} isPending />
          <Skeleton className="ms-auto mt-0.5 h-4 w-full max-w-14 shrink-2" />
        </Card>
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}
