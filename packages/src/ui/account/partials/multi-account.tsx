'use client';

import { useState } from 'react';
import type { Session, User } from 'better-auth';
import { EllipsisIcon, LogOutIcon, RepeatIcon, UserX2Icon } from 'lucide-react';

import {
  Button,
  Card,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Spinner,
} from '@pelatform/ui/default';
import { useAuth, useAuthHooks } from '../../../hooks/index';
import { useLocalization } from '../../../hooks/private';
import { cn, getLocalizedError } from '../../../lib/utils';
import type { Refetch } from '../../../types/generals';
import type { CardComponentProps } from '../../../types/ui';
import { CardComponent } from '../../shared/components/card';
import { SkeletonViewComponent } from '../../shared/components/skeleton';
import { UserView } from '../../shared/view';

export function MultiAccountCard({
  className,
  classNames,
  localization: localizationProp,
  ...props
}: CardComponentProps) {
  const { basePath, navigate, viewPaths } = useAuth();
  const { useSession, useListDeviceSessions } = useAuthHooks();
  const { data: sessionData, isPending: sessionPending } = useSession();
  const {
    data: deviceSessions,
    isPending: deviceSessionPending,
    refetch: refetchDeviceSessions,
  } = useListDeviceSessions();

  const localization = useLocalization(localizationProp);

  const isPending = sessionPending || deviceSessionPending;

  const otherDeviceSessions = (deviceSessions || []).filter(
    (ds) => ds.session.id !== sessionData?.session.id,
  );

  return (
    <CardComponent
      className={className}
      classNames={classNames}
      title={localization.ACCOUNTS}
      description={localization.ACCOUNTS_DESCRIPTION}
      instructions={localization.ACCOUNTS_INSTRUCTIONS}
      actionLabel={localization.ADD_ACCOUNT}
      action={() => navigate(`${basePath}/${viewPaths.SIGN_IN}`)}
      isPending={isPending}
      {...props}
    >
      {isPending ? (
        <div className={cn('grid gap-4', classNames?.grid)}>
          <SkeletonViewComponent classNames={classNames} />
        </div>
      ) : (
        deviceSessions &&
        deviceSessions.length > 0 && (
          <div className={cn('grid gap-4', classNames?.grid)}>
            {sessionData && (
              <MultiAccountCell
                classNames={classNames}
                localization={localization}
                deviceSession={sessionData}
                refetch={refetchDeviceSessions}
              />
            )}

            {otherDeviceSessions.map((deviceSession) => (
              <MultiAccountCell
                key={deviceSession.session.id}
                classNames={classNames}
                localization={localization}
                deviceSession={deviceSession}
                refetch={refetchDeviceSessions}
              />
            ))}
          </div>
        )
      )}
    </CardComponent>
  );
}

function MultiAccountCell({
  className,
  classNames,
  localization,
  deviceSession,
  refetch: refetchDeviceSessions,
}: CardComponentProps & {
  deviceSession: { user: User; session: Session };
  refetch?: Refetch;
}) {
  const { basePath, navigate, viewPaths, toast } = useAuth();
  const { useSession, useRevokeDeviceSession, useSetActiveSession } = useAuthHooks();
  const { data: sessionData } = useSession();
  const { mutate: revokeDeviceSession } = useRevokeDeviceSession();
  const { mutate: setActiveSession } = useSetActiveSession();

  const [isLoading, setIsLoading] = useState(false);

  const handleRevoke = async () => {
    setIsLoading(true);

    try {
      await revokeDeviceSession({
        sessionToken: deviceSession.session.token,
      });

      refetchDeviceSessions?.();
    } catch (error) {
      setIsLoading(false);

      toast({ message: getLocalizedError({ error, localization }) });
    }
  };

  const handleSetActiveSession = async () => {
    setIsLoading(true);

    try {
      await setActiveSession({
        sessionToken: deviceSession.session.token,
      });

      refetchDeviceSessions?.();
    } catch (error) {
      toast({ message: getLocalizedError({ error, localization }) });
    }

    setIsLoading(false);
  };

  const isCurrentSession = deviceSession.session.id === sessionData?.session.id;

  return (
    <Card className={cn('flex-row items-center p-4', className, classNames?.cell)}>
      <UserView localization={localization} user={deviceSession.user} />

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
          {!isCurrentSession && (
            <DropdownMenuItem onClick={handleSetActiveSession}>
              <RepeatIcon className={classNames?.icon} />
              {localization?.SWITCH_ACCOUNT}
            </DropdownMenuItem>
          )}

          <DropdownMenuItem
            variant="destructive"
            onClick={() => {
              if (isCurrentSession) {
                navigate(`${basePath}/${viewPaths.SIGN_OUT}`);
                return;
              }
              handleRevoke();
            }}
          >
            {isCurrentSession ? (
              <LogOutIcon className={classNames?.icon} />
            ) : (
              <UserX2Icon className={classNames?.icon} />
            )}
            {isCurrentSession ? localization?.SIGN_OUT : localization?.REVOKE}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Card>
  );
}
