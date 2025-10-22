'use client';

import { useState } from 'react';
import type { Session } from 'better-auth';
import { LaptopIcon, SmartphoneIcon } from 'lucide-react';
import { UAParser } from 'ua-parser-js';

import { Button, Card, Spinner } from '@pelatform/ui/default';
import { useAuth, useAuthHooks } from '@/hooks';
import { useLocalization } from '@/hooks/private';
import { cn, getLocalizedError } from '@/lib/utils';
import type { Refetch } from '@/types/generals';
import type { CardComponentProps } from '@/types/ui';
import { CardComponent } from '../../shared/components/card';
import { SkeletonCellComponent } from '../../shared/components/skeleton';

export function SessionsCard({
  className,
  classNames,
  localization: localizationProp,
  ...props
}: CardComponentProps) {
  const { useListSessions } = useAuthHooks();
  const { data: sessions, isPending, refetch } = useListSessions();

  const localization = useLocalization(localizationProp);

  return (
    <CardComponent
      className={className}
      classNames={classNames}
      title={localization.SESSIONS}
      description={localization.SESSIONS_DESCRIPTION}
      isPending={isPending}
      {...props}
    >
      <div className={cn('grid gap-4', classNames?.grid)}>
        {isPending ? (
          <SkeletonCellComponent classNames={classNames} />
        ) : (
          sessions?.map((session) => (
            <SessionCell
              key={session.id}
              classNames={classNames}
              localization={localization}
              refetch={refetch}
              session={session}
            />
          ))
        )}
      </div>
    </CardComponent>
  );
}

function SessionCell({
  className,
  classNames,
  localization,
  refetch,
  session,
}: CardComponentProps & {
  refetch?: Refetch;
  session: Session;
}) {
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
          {isCurrentSession ? localization?.CURRENT_SESSION : session?.ipAddress}
        </span>

        <span className="text-muted-foreground text-xs">
          {session.userAgent?.includes('tauri-plugin-http')
            ? localization?.APP
            : parser.os.name && parser.browser.name
              ? `${parser.os.name}, ${parser.browser.name}`
              : parser.os.name || parser.browser.name || session.userAgent || localization?.UNKNOWN}
        </span>
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        className={cn('relative ms-auto', classNames?.button, classNames?.outlineButton)}
        onClick={handleRevoke}
        disabled={isLoading}
      >
        {isLoading && <Spinner />}
        {isCurrentSession ? localization?.SIGN_OUT : localization?.REVOKE}
      </Button>
    </Card>
  );
}
