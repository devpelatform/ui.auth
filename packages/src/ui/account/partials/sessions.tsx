'use client';

import { useMemo, useState } from 'react';
import type { Session } from 'better-auth';
import { LaptopIcon, Loader2, SmartphoneIcon } from 'lucide-react';
import { UAParser } from 'ua-parser-js';

import { Button, Card, CardContent } from '@pelatform/ui/default';
import { useAuth, useAuthHooks } from '@/hooks';
import type { AuthLocalization } from '@/lib/localization';
import { cn, getLocalizedError } from '@/lib/utils';
import type { Refetch } from '@/types/generals';
import { SettingsCard, type SettingsCardClassNames } from '../../shared/settings-card';
import { SettingsCellSkeleton } from '../../shared/settings-skeleton';

export interface SessionsCardProps {
  className?: string;
  classNames?: SettingsCardClassNames;
  localization?: AuthLocalization;
}

export function SessionsCard({
  className,
  classNames,
  localization: localizationProp,
}: SessionsCardProps) {
  const { localization: localizationContext } = useAuth();
  const { useListSessions } = useAuthHooks();
  const { data: sessions, isPending, refetch } = useListSessions();

  const localization = useMemo(
    () => ({ ...localizationContext, ...localizationProp }),
    [localizationContext, localizationProp],
  );

  return (
    <SettingsCard
      className={className}
      classNames={classNames}
      description={localization.SESSIONS_DESCRIPTION}
      isPending={isPending}
      title={localization.SESSIONS}
    >
      <CardContent className={cn('grid gap-4', classNames?.content)}>
        {isPending ? (
          <SettingsCellSkeleton classNames={classNames} />
        ) : (
          sessions?.map((session) => (
            <SessionCell
              key={session.id}
              classNames={classNames}
              localization={localization}
              session={session}
              refetch={refetch}
            />
          ))
        )}
      </CardContent>
    </SettingsCard>
  );
}

interface SessionCellProps {
  className?: string;
  classNames?: SettingsCardClassNames;
  localization: AuthLocalization;
  session: Session;
  refetch?: Refetch;
}

function SessionCell({ className, classNames, localization, session, refetch }: SessionCellProps) {
  const { basePath, navigate, toast, viewPaths } = useAuth();
  const { useSession, useRevokeSession } = useAuthHooks();
  const { data: sessionData } = useSession();
  const { mutate: revokeSession } = useRevokeSession();

  const isCurrentSession = session.id === sessionData?.session?.id;

  const [isLoading, setIsLoading] = useState(false);

  const handleRevoke = async () => {
    setIsLoading(true);

    if (isCurrentSession) {
      navigate(`${basePath}/${viewPaths.SIGN_OUT}`);
      return;
    }

    try {
      await revokeSession({ token: session.token });
      refetch?.();
    } catch (error) {
      toast({
        message: getLocalizedError({ error, localization }),
      });

      setIsLoading(false);
    }
  };

  const parser = UAParser(session.userAgent as string);
  const isMobile = parser.device.type === 'mobile';

  return (
    <Card className={cn('flex-row items-center gap-3 px-4 py-3', className, classNames?.cell)}>
      {isMobile ? (
        <SmartphoneIcon className={cn('size-4', classNames?.icon)} />
      ) : (
        <LaptopIcon className={cn('size-4', classNames?.icon)} />
      )}

      <div className="flex flex-col">
        <span className="font-semibold text-sm">
          {isCurrentSession ? localization.CURRENT_SESSION : session?.ipAddress}
        </span>

        <span className="text-muted-foreground text-xs">
          {session.userAgent?.includes('tauri-plugin-http')
            ? localization.APP
            : parser.os.name && parser.browser.name
              ? `${parser.os.name}, ${parser.browser.name}`
              : parser.os.name || parser.browser.name || session.userAgent || localization.UNKNOWN}
        </span>
      </div>

      <Button
        className={cn('relative ms-auto', classNames?.button, classNames?.outlineButton)}
        disabled={isLoading}
        size="sm"
        variant="outline"
        onClick={handleRevoke}
      >
        {isLoading && <Loader2 className="animate-spin" />}
        {isCurrentSession ? localization.SIGN_OUT : localization.REVOKE}
      </Button>
    </Card>
  );
}
