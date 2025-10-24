'use client';

import { type ComponentProps, type ReactNode, useCallback, useEffect, useState } from 'react';
import { ChevronsUpDown, LogInIcon, PlusCircleIcon, SettingsIcon } from 'lucide-react';

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@pelatform/ui/default';
import { useAuth, useOrganization } from '../../hooks/main';
import { useLocalization } from '../../hooks/private';
import { useListOrganizations } from '../../hooks/use-list-organizations';
import { useSession } from '../../hooks/use-session';
import { cn, getLocalizedError } from '../../lib/utils';
import type { Organization, User } from '../../types/auth';
import type { AvatarClassNames, BaseProps, ViewClassNames } from '../../types/ui';
import { CreateOrganizationDialog } from '../organizations/dialogs/create-organization';
import { OrganizationLogo, UserAvatar } from './avatar';
import { OrgView, PersonalAccountView } from './view';

export type OrganizationSwitcherClassNames = {
  base?: string;
  trigger?: {
    base?: string;
    avatar?: AvatarClassNames;
    organization?: ViewClassNames;
    user?: ViewClassNames;
  };
  content?: {
    base?: string;
    menuItem?: string;
    separator?: string;
    organization?: ViewClassNames;
    user?: ViewClassNames;
  };
};

export interface OrganizationSwitcherProps extends BaseProps, ComponentProps<typeof Button> {
  classNames?: OrganizationSwitcherClassNames;
  align?: 'center' | 'start' | 'end';
  alignOffset?: number;
  side?: 'top' | 'right' | 'bottom' | 'left';
  sideOffset?: number;
  trigger?: ReactNode;
  onSetActive?: (organization: Organization | null) => void;
  hidePersonal?: boolean;
  personalPath?: string;
}

export function OrganizationSwitcher({
  className,
  classNames,
  localization: localizationProp,
  align,
  alignOffset,
  side,
  sideOffset,
  trigger,
  onSetActive,
  hidePersonal,
  personalPath,
  size,
  ...props
}: OrganizationSwitcherProps) {
  const {
    account: accountOptions,
    basePath: basePathMain,
    Link,
    toast,
    viewPaths: viewPathsMain,
  } = useAuth();
  const {
    basePath,
    currentPath,
    data: activeOrganization,
    isPending: organizationPending,
    isRefetching: organizationRefetching,
    setLastVisited,
    viewPaths,
  } = useOrganization();
  const { data: sessionData, isPending: sessionPending } = useSession();
  const { data: organizations, isPending: organizationsPending } = useListOrganizations();

  const user = sessionData?.user;

  const localization = useLocalization(localizationProp);

  const [activeOrganizationPending, setActiveOrganizationPending] = useState(false);
  const [isCreateOrgDialogOpen, setIsCreateOrgDialogOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isPending =
    sessionPending || organizationPending || organizationsPending || activeOrganizationPending;

  // biome-ignore lint/correctness/useExhaustiveDependencies: ignore
  useEffect(() => {
    if (organizationRefetching) return;

    setActiveOrganizationPending(false);
  }, [activeOrganization, organizationRefetching]);

  const switchOrganization = useCallback(
    async (organization: Organization | null, isPersonal: boolean = false) => {
      // Prevent switching to personal account when hidePersonal is true
      if (hidePersonal && organization === null) {
        return;
      }

      setActiveOrganizationPending(true);

      try {
        onSetActive?.(organization);

        const accountPath =
          personalPath || `${accountOptions?.basePath}/${accountOptions?.viewPaths.SETTINGS}`;
        setLastVisited({
          organization: organization as Organization,
          personalPath: isPersonal ? accountPath : undefined,
        });
      } catch (error) {
        toast({
          message: getLocalizedError({ error, localization }),
        });

        setActiveOrganizationPending(false);
      }
    },
    [
      toast,
      localization,
      onSetActive,
      hidePersonal,
      setLastVisited,
      personalPath,
      accountOptions?.basePath,
      accountOptions?.viewPaths,
    ],
  );

  // Auto - select first organization when hidePersonal is true
  useEffect(() => {
    if (
      hidePersonal &&
      !activeOrganization &&
      !activeOrganizationPending &&
      organizations &&
      organizations.length > 0 &&
      !sessionPending &&
      !organizationPending
    ) {
      switchOrganization(organizations[0]);
    }
  }, [
    hidePersonal,
    activeOrganization,
    activeOrganizationPending,
    organizations,
    sessionPending,
    organizationPending,
    switchOrganization,
  ]);

  return (
    <>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          {trigger ||
            (size === 'icon' ? (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={cn('size-fit rounded-full', classNames?.trigger?.base)}
                {...props}
              >
                {isPending ||
                activeOrganization ||
                !sessionData ||
                (user as User)?.isAnonymous ||
                hidePersonal ? (
                  <OrganizationLogo
                    key={activeOrganization?.logo}
                    className={cn(className, classNames?.base)}
                    classNames={classNames?.trigger?.avatar}
                    isPending={isPending}
                    localization={localization}
                    organization={activeOrganization}
                    aria-label={localization.ORGANIZATION}
                  />
                ) : (
                  <UserAvatar
                    key={user?.image}
                    className={cn(className, classNames?.base)}
                    classNames={classNames?.trigger?.avatar}
                    localization={localization}
                    user={user}
                    aria-label={localization.ACCOUNT}
                  />
                )}
              </Button>
            ) : (
              <Button
                size={size}
                className={cn('h-fit p-2!', className, classNames?.trigger?.base)}
                {...props}
              >
                {isPending ||
                activeOrganization ||
                !sessionData ||
                (user as User)?.isAnonymous ||
                hidePersonal ? (
                  <OrgView
                    classNames={classNames?.trigger?.organization}
                    isPending={isPending}
                    localization={localization}
                    organization={activeOrganization}
                    size={size}
                  />
                ) : (
                  <PersonalAccountView
                    classNames={classNames?.trigger?.user}
                    localization={localization}
                    size={size}
                    user={user}
                  />
                )}
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
          <div
            className={cn(
              'flex items-center justify-between gap-2 p-2',
              classNames?.content?.menuItem,
            )}
          >
            {(user && !(user as User).isAnonymous) || isPending ? (
              <>
                {activeOrganizationPending || activeOrganization || hidePersonal ? (
                  <OrgView
                    classNames={classNames?.content?.organization}
                    isPending={isPending || activeOrganizationPending}
                    localization={localization}
                    organization={activeOrganization}
                  />
                ) : (
                  <PersonalAccountView
                    classNames={classNames?.content?.user}
                    isPending={isPending}
                    localization={localization}
                    user={user}
                  />
                )}

                {!isPending && (
                  <Link
                    href={
                      activeOrganization
                        ? `${basePath}${currentPath}/${viewPaths?.SETTINGS}`
                        : `${accountOptions?.basePath}/${accountOptions?.viewPaths.SETTINGS}`
                    }
                  >
                    <Button
                      variant="outline"
                      size="icon"
                      className="!size-8 ml-auto"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <SettingsIcon className="size-4" />
                    </Button>
                  </Link>
                )}
              </>
            ) : (
              <div className="-my-1 text-muted-foreground text-xs">{localization.ORGANIZATION}</div>
            )}
          </div>

          <DropdownMenuSeparator className={classNames?.content?.separator} />

          {activeOrganization && !hidePersonal && (
            <DropdownMenuItem onClick={() => switchOrganization(null, true)}>
              <PersonalAccountView
                classNames={classNames?.content?.user}
                isPending={isPending}
                localization={localization}
                user={user}
              />
            </DropdownMenuItem>
          )}

          {organizations?.map(
            (organization) =>
              organization.id !== activeOrganization?.id && (
                <DropdownMenuItem
                  key={organization.id}
                  onClick={() => switchOrganization(organization, false)}
                >
                  <OrgView
                    classNames={classNames?.content?.organization}
                    isPending={isPending}
                    localization={localization}
                    organization={organization}
                  />
                </DropdownMenuItem>
              ),
          )}

          {organizations &&
            organizations.length > 0 &&
            (!hidePersonal || organizations.length > 1) && (
              <DropdownMenuSeparator className={classNames?.content?.separator} />
            )}

          {!isPending && sessionData && !(user as User).isAnonymous ? (
            <DropdownMenuItem
              className={cn(classNames?.content?.menuItem)}
              onClick={() => setIsCreateOrgDialogOpen(true)}
            >
              <PlusCircleIcon />
              {localization.CREATE_ORGANIZATION}
            </DropdownMenuItem>
          ) : (
            <Link href={`${basePathMain}/${viewPathsMain.SIGN_IN}`}>
              <DropdownMenuItem className={cn(classNames?.content?.menuItem)}>
                <LogInIcon />
                {localization.SIGN_IN}
              </DropdownMenuItem>
            </Link>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <CreateOrganizationDialog
        localization={localization}
        open={isCreateOrgDialogOpen}
        onOpenChange={setIsCreateOrgDialogOpen}
      />
    </>
  );
}
