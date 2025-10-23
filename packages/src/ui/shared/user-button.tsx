'use client';

import {
  type ComponentProps,
  Fragment,
  type ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';
import {
  ChevronsUpDown,
  LogInIcon,
  LogOutIcon,
  PlusCircleIcon,
  SettingsIcon,
  UserRoundPlus,
} from 'lucide-react';

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@pelatform/ui/default';
import { useAuth, useAuthHooks } from '../../hooks/index';
import { useIsHydrated, useLocalization } from '../../hooks/private';
import { cn, getLocalizedError } from '../../lib/utils';
import type { AnyAuthClient, User } from '../../types/auth';
import type { AvatarClassNames, BaseProps, ViewClassNames } from '../../types/ui';
import { UserAvatar } from './avatar';
import { UserView } from './view';

export type UserButtonClassNames = {
  base?: string;
  trigger?: {
    base?: string;
    avatar?: AvatarClassNames;
    user?: ViewClassNames;
  };
  content?: {
    base?: string;
    menuItem?: string;
    separator?: string;
    user?: ViewClassNames;
  };
};

export interface UserButtonProps extends BaseProps, ComponentProps<typeof Button> {
  classNames?: UserButtonClassNames;
  align?: 'center' | 'start' | 'end';
  alignOffset?: number;
  side?: 'top' | 'right' | 'bottom' | 'left';
  sideOffset?: number;
  trigger?: ReactNode;
  additionalLinks?: {
    href: string;
    icon?: ReactNode;
    label: ReactNode;
    signedIn?: boolean;
    separator?: boolean;
  }[];
  disableDefaultLinks?: boolean;
}

export function UserButton({
  className,
  classNames,
  localization: localizationProp,
  align,
  alignOffset,
  side,
  sideOffset,
  trigger,
  additionalLinks,
  disableDefaultLinks,
  size,
  ...props
}: UserButtonProps) {
  const {
    account: accountOptions,
    basePath,
    Link,
    multiSession,
    onSessionChange,
    signUp,
    toast,
    viewPaths,
  } = useAuth();
  const { useSession, useListDeviceSessions, useSetActiveSession } = useAuthHooks();
  const { mutate: setActiveSession } = useSetActiveSession();
  const { data: sessionData, isPending: sessionPending } = useSession();
  const user = sessionData?.user;

  const localization = useLocalization(localizationProp);
  const isHydrated = useIsHydrated();

  let deviceSessions: AnyAuthClient['$Infer']['Session'][] | undefined | null = null;
  let deviceSessionsPending = false;

  if (multiSession) {
    const { data, isPending } = useListDeviceSessions();
    deviceSessions = data;
    deviceSessionsPending = isPending;
  }

  const [activeSessionPending, setActiveSessionPending] = useState(false);
  const isPending = sessionPending || activeSessionPending || !isHydrated;

  const switchAccount = useCallback(
    async (sessionToken: string) => {
      setActiveSessionPending(true);

      try {
        await setActiveSession({ sessionToken });

        onSessionChange?.();
        // Reset pending state after successful switch
        setActiveSessionPending(false);
      } catch (error) {
        toast({
          message: getLocalizedError({ error, localization }),
        });
        setActiveSessionPending(false);
      }
    },
    [setActiveSession, onSessionChange, toast, localization],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: sessionData?.user?.id is needed to reset pending state when user changes
  useEffect(() => {
    if (!multiSession) return;

    setActiveSessionPending(false);
  }, [multiSession, sessionData?.user?.id]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className={cn(size === 'icon' && 'rounded-full', classNames?.trigger?.base)}
      >
        {trigger ||
          (size === 'icon' ? (
            <Button variant="ghost" size="icon" className="size-fit rounded-full">
              <UserAvatar
                key={user?.image}
                className={cn(className, classNames?.base)}
                classNames={classNames?.trigger?.avatar}
                isPending={isPending}
                localization={localization}
                user={user}
                aria-label={localization.ACCOUNT}
              />
            </Button>
          ) : (
            <Button
              size={size}
              className={cn('h-fit p-2!', className, classNames?.trigger?.base)}
              {...props}
            >
              <UserView
                classNames={classNames?.trigger?.user}
                isPending={isPending}
                localization={localization}
                size={size}
                user={!(user as User)?.isAnonymous ? user : null}
              />
              <ChevronsUpDown className="ms-auto" />
            </Button>
          ))}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className={cn(
          'w-[--radix-dropdown-menu-trigger-width] min-w-56 max-w-64',
          classNames?.content?.base,
        )}
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <div className={cn('p-2', classNames?.content?.menuItem)}>
          {(user && !(user as User).isAnonymous) || isPending ? (
            <UserView
              classNames={classNames?.content?.user}
              isPending={isPending}
              localization={localization}
              user={user}
            />
          ) : (
            <div className="-my-1 text-muted-foreground text-xs">{localization.ACCOUNT}</div>
          )}
        </div>

        <DropdownMenuSeparator className={classNames?.content?.separator} />
        {additionalLinks?.map(
          ({ href, icon, label, signedIn, separator }, index) =>
            (signedIn === undefined ||
              (signedIn && !!sessionData) ||
              (!signedIn && !sessionData)) && (
              <Fragment key={index}>
                <Link href={href}>
                  <DropdownMenuItem className={classNames?.content?.menuItem}>
                    {icon}
                    {label}
                  </DropdownMenuItem>
                </Link>
                {separator && <DropdownMenuSeparator className={classNames?.content?.separator} />}
              </Fragment>
            ),
        )}

        {!user || (user as User).isAnonymous ? (
          <>
            <Link href={`${basePath}/${viewPaths.SIGN_IN}`}>
              <DropdownMenuItem className={classNames?.content?.menuItem}>
                <LogInIcon />
                {localization.SIGN_IN}
              </DropdownMenuItem>
            </Link>

            {signUp && (
              <Link href={`${basePath}/${viewPaths.SIGN_UP}`}>
                <DropdownMenuItem className={classNames?.content?.menuItem}>
                  <UserRoundPlus />
                  {localization.SIGN_UP}
                </DropdownMenuItem>
              </Link>
            )}
          </>
        ) : (
          <>
            {!disableDefaultLinks && accountOptions && (
              <Link href={`${accountOptions.basePath}/${accountOptions.viewPaths?.SETTINGS}`}>
                <DropdownMenuItem className={classNames?.content?.menuItem}>
                  <SettingsIcon />
                  {localization.SETTINGS}
                </DropdownMenuItem>
              </Link>
            )}

            <Link href={`${basePath}/${viewPaths.SIGN_OUT}`}>
              <DropdownMenuItem className={classNames?.content?.menuItem}>
                <LogOutIcon />
                {localization.SIGN_OUT}
              </DropdownMenuItem>
            </Link>
          </>
        )}

        {user && multiSession && (
          <>
            <DropdownMenuSeparator className={classNames?.content?.separator} />
            {!deviceSessions && deviceSessionsPending && (
              <>
                <DropdownMenuItem disabled className={classNames?.content?.menuItem}>
                  <UserView classNames={classNames?.content?.user} isPending={true} />
                </DropdownMenuItem>

                <DropdownMenuSeparator className={classNames?.content?.separator} />
              </>
            )}

            {deviceSessions
              ?.filter((sessionData) => sessionData.user.id !== user?.id)
              .map(({ session, user }) => (
                <Fragment key={session.id}>
                  <DropdownMenuItem
                    className={classNames?.content?.menuItem}
                    onClick={() => switchAccount(session.token)}
                  >
                    <UserView classNames={classNames?.content?.user} user={user} />
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className={classNames?.content?.separator} />
                </Fragment>
              ))}

            <Link href={`${basePath}/${viewPaths.SIGN_IN}`}>
              <DropdownMenuItem className={classNames?.content?.menuItem}>
                <PlusCircleIcon />
                {localization.ADD_ACCOUNT}
              </DropdownMenuItem>
            </Link>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
