'use client';

import { useState } from 'react';
import { LaptopIcon, SmartphoneIcon } from 'lucide-react';
import { UAParser } from 'ua-parser-js';

import { Button, Card, Spinner } from '@pelatform/ui/default';
import { useAuth } from '../../../hooks/main';
import { useLocalization } from '../../../hooks/private';
import { useListSessions } from '../../../hooks/use-list-sessions';
import { useRevokeSession } from '../../../hooks/use-revoke-session';
import { useSession } from '../../../hooks/use-session';
import { cn, getLocalizedError } from '../../../lib/utils';
import type { Session } from '../../../types/auth';
import type { Refetch } from '../../../types/generals';
import type { CardComponentProps } from '../../../types/ui';
import { CardComponent } from '../../shared/components/card';
import { SkeletonViewComponent } from '../../shared/components/skeleton';

export function SessionsCard({
  className,
  classNames,
  localization: localizationProp,
  ...props
}: CardComponentProps) {
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
          <SkeletonViewComponent classNames={classNames} />
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
    <Card className={cn('flex-row items-center p-4', className, classNames?.cell)}>
      <div className="flex items-center gap-3">
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
                : parser.os.name ||
                  parser.browser.name ||
                  session.userAgent ||
                  localization?.UNKNOWN}
          </span>
        </div>
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
