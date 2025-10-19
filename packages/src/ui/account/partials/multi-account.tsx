'use client';

import { useMemo, useState } from 'react';
import type { Session, User } from 'better-auth';
import { EllipsisIcon, Loader2, LogOutIcon, RepeatIcon, UserX2Icon } from 'lucide-react';

import {
  Button,
  Card,
  CardContent,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@pelatform/ui/default';
import { useAuth, useAuthHooks } from '@/hooks';
import type { AuthLocalization } from '@/lib/localization';
import { cn, getLocalizedError } from '@/lib/utils';
import type { Refetch } from '@/types/generals';
import { SettingsCard, type SettingsCardClassNames } from '../../shared/settings-card';
import { UserView } from '../../shared/user-view';

export interface MultiAccountCardProps {
  className?: string;
  classNames?: SettingsCardClassNames;
  localization?: AuthLocalization;
}

export function MultiAccountCard({
  className,
  classNames,
  localization: localizationProp,
}: MultiAccountCardProps) {
  const { basePath, localization: localizationContext, navigate, viewPaths } = useAuth();
  const { useListDeviceSessions, useSession } = useAuthHooks();
  const { data: deviceSessions, isPending, refetch } = useListDeviceSessions();
  const { data: sessionData } = useSession();

  const localization = useMemo(
    () => ({ ...localizationContext, ...localizationProp }),
    [localizationContext, localizationProp],
  );

  const otherDeviceSessions = (deviceSessions || []).filter(
    (ds) => ds.session.id !== sessionData?.session.id,
  );

  return (
    <SettingsCard
      className={className}
      classNames={classNames}
      title={localization.ACCOUNTS}
      description={localization.ACCOUNTS_DESCRIPTION}
      actionLabel={localization.ADD_ACCOUNT}
      instructions={localization.ACCOUNTS_INSTRUCTIONS}
      isPending={isPending}
      action={() => navigate(`${basePath}/${viewPaths.SIGN_IN}`)}
    >
      {deviceSessions?.length && (
        <CardContent className={cn('grid gap-4', classNames?.content)}>
          {sessionData && (
            <MultiAccountCell
              classNames={classNames}
              deviceSession={sessionData}
              localization={localization}
              refetch={refetch}
            />
          )}

          {otherDeviceSessions.map((deviceSession) => (
            <MultiAccountCell
              key={deviceSession.session.id}
              classNames={classNames}
              deviceSession={deviceSession}
              localization={localization}
              refetch={refetch}
            />
          ))}
        </CardContent>
      )}
    </SettingsCard>
  );
}

interface MultiAccountCellProps {
  className?: string;
  classNames?: SettingsCardClassNames;
  deviceSession: { user: User; session: Session };
  localization: AuthLocalization;
  refetch?: Refetch;
}

function MultiAccountCell({
  className,
  classNames,
  deviceSession,
  localization,
  refetch,
}: MultiAccountCellProps) {
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

      refetch?.();
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

      refetch?.();
    } catch (error) {
      toast({ message: getLocalizedError({ error, localization }) });
    }

    setIsLoading(false);
  };

  const isCurrentSession = deviceSession.session.id === sessionData?.session.id;

  return (
    <Card className={cn('flex-row p-4', className, classNames?.cell)}>
      <UserView user={deviceSession.user} localization={localization} />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className={cn('relative ms-auto', classNames?.button, classNames?.outlineButton)}
            disabled={isLoading}
            size="icon"
            type="button"
            variant="outline"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <EllipsisIcon className={classNames?.icon} />
            )}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          {!isCurrentSession && (
            <DropdownMenuItem onClick={handleSetActiveSession}>
              <RepeatIcon className={classNames?.icon} />

              {localization.SWITCH_ACCOUNT}
            </DropdownMenuItem>
          )}

          <DropdownMenuItem
            onClick={() => {
              if (isCurrentSession) {
                navigate(`${basePath}/${viewPaths.SIGN_OUT}`);
                return;
              }

              handleRevoke();
            }}
            variant="destructive"
          >
            {isCurrentSession ? (
              <LogOutIcon className={classNames?.icon} />
            ) : (
              <UserX2Icon className={classNames?.icon} />
            )}

            {isCurrentSession ? localization.SIGN_OUT : localization.REVOKE}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Card>
  );
}
