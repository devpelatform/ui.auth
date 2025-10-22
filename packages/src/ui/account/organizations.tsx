'use client';

import { useCallback, useState } from 'react';
import type { Organization } from 'better-auth/plugins/organization';
import { EllipsisIcon, LogOutIcon, SettingsIcon } from 'lucide-react';

import {
  Button,
  Card,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Spinner,
} from '@pelatform/ui/default';
import { useAuth, useAuthHooks, useOrganization } from '@/hooks';
import { useIsHydrated, useLocalization } from '@/hooks/private';
import { cn, getLocalizedError } from '@/lib/utils';
import { CreateOrganizationDialog } from '../organizations/dialogs/create-organization';
import { LeaveOrganizationDialog } from '../organizations/dialogs/leave-organization';
import { CardComponent } from '../shared/components/card';
import { SkeletonCellComponent } from '../shared/components/skeleton';
import { OrganizationView } from '../shared/view';
import type { AccountBaseProps } from './types';

export function OrganizationsCard({
  className,
  classNames,
  localization: localizationProp,
  ...props
}: AccountBaseProps) {
  const { useListOrganizations } = useAuthHooks();
  const { data: organizations, isPending: organizationsPending } = useListOrganizations();

  const localization = useLocalization(localizationProp);
  const isHydrated = useIsHydrated();
  const isPending = !isHydrated || organizationsPending;

  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  return (
    <>
      <CardComponent
        className={className}
        classNames={classNames}
        title={localization.ORGANIZATIONS}
        description={localization.ORGANIZATIONS_DESCRIPTION}
        instructions={localization.ORGANIZATIONS_INSTRUCTIONS}
        actionLabel={localization.CREATE_ORGANIZATION}
        action={() => setCreateDialogOpen(true)}
        isPending={isPending}
        {...props}
      >
        {organizations && organizations.length > 0 && (
          <div className={cn('grid gap-4', classNames?.grid)}>
            {isPending && <SkeletonCellComponent />}
            {organizations?.map((organization) => (
              <OrganizationCell
                key={organization.id}
                classNames={classNames}
                localization={localization}
                organization={organization}
              />
            ))}
          </div>
        )}
      </CardComponent>

      <CreateOrganizationDialog
        classNames={classNames}
        localization={localization}
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </>
  );
}

function OrganizationCell({
  className,
  classNames,
  localization,
  organization,
}: AccountBaseProps & { organization: Organization }) {
  const { authClient, navigate, toast } = useAuth();
  const { basePath, pathMode, setLastVisited, viewPaths } = useOrganization();

  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);
  const [isManagingOrganization, setIsManagingOrganization] = useState(false);

  const handleManageOrganization = useCallback(async () => {
    setIsManagingOrganization(true);

    if (pathMode === 'slug') {
      setLastVisited(organization);
      navigate(`${basePath}/${organization.slug}/${viewPaths.SETTINGS}`);
      return;
    }

    try {
      await authClient.organization.setActive({
        organizationId: organization.id,
        fetchOptions: {
          throw: true,
        },
      });

      navigate(`${basePath}/${viewPaths?.SETTINGS}`);
    } catch (error) {
      toast({
        message: getLocalizedError({ error, localization }),
      });

      setIsManagingOrganization(false);
    }
  }, [
    authClient,
    organization,
    basePath,
    viewPaths?.SETTINGS,
    pathMode,
    navigate,
    toast,
    localization,
    setLastVisited,
  ]);

  return (
    <>
      <Card className={cn('flex-row p-4', className, classNames?.cell)}>
        <OrganizationView localization={localization} organization={organization} />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className={cn('relative ms-auto', classNames?.button, classNames?.outlineButton)}
              disabled={isManagingOrganization}
            >
              {isManagingOrganization ? <Spinner /> : <EllipsisIcon className={classNames?.icon} />}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" onCloseAutoFocus={(e) => e.preventDefault()}>
            <DropdownMenuItem onClick={handleManageOrganization} disabled={isManagingOrganization}>
              <SettingsIcon className={classNames?.icon} />
              {localization?.MANAGE_ORGANIZATION}
            </DropdownMenuItem>

            <DropdownMenuItem variant="destructive" onClick={() => setIsLeaveDialogOpen(true)}>
              <LogOutIcon className={classNames?.icon} />
              {localization?.LEAVE_ORGANIZATION}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Card>

      <LeaveOrganizationDialog
        classNames={classNames}
        localization={localization}
        open={isLeaveDialogOpen}
        onOpenChange={setIsLeaveDialogOpen}
        organization={organization}
      />
    </>
  );
}
