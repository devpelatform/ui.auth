'use client';

import { useCallback, useState } from 'react';
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
import { useAuth, useOrganization } from '../../hooks/main';
import { useIsHydrated, useLocalization } from '../../hooks/private';
import { useListOrganizations } from '../../hooks/use-list-organizations';
import { cn, getLocalizedError } from '../../lib/utils';
import type { Organization } from '../../types/auth';
import { CreateOrganizationDialog } from '../organizations/dialogs/create-organization';
import { LeaveOrganizationDialog } from '../organizations/dialogs/leave-organization';
import { CardComponent } from '../shared/components/card';
import { SkeletonViewComponent } from '../shared/components/skeleton';
import { OrgView } from '../shared/view';
import type { AccountBaseProps } from './types';

export function OrganizationsCard({
  className,
  classNames,
  localization: localizationProp,
  ...props
}: AccountBaseProps) {
  const { data: organizations, isPending: organizationsPending } = useListOrganizations();

  const localization = useLocalization(localizationProp);
  const isHydrated = useIsHydrated();
  const isPending = !isHydrated || organizationsPending || !organizations;

  // const { authClient } = useAuth();
  // const [ownerStatusByOrg, setOwnerStatusByOrg] = useState<Record<string, 'owner' | 'non-owner'>>({});

  // useEffect(() => {
  //   let cancelled = false;

  //   async function loadRoles() {
  //     if (!organizations || organizations.length === 0) {
  //       setOwnerStatusByOrg({});
  //       return;
  //     }

  //     try {
  //       const entries = await Promise.all(
  //         organizations.map(async (org) => {
  //           const { data } = await authClient.organization.getActiveMemberRole({
  //             query: {
  //               organizationId: org?.id,
  //             },
  //           });
  //           const status = data?.role === 'owner' ? 'owner' : 'non-owner';
  //           console.log('[OrgRole] id:', org.id, 'role:', data?.role, 'status:', status);
  //           return [org.id, status] as const;
  //         }),
  //       );

  //       if (cancelled) return;
  //       const map: Record<string, 'owner' | 'non-owner'> = {};
  //       for (const [id, status] of entries) {
  //         map[id] = status;
  //       }
  //       console.log('[OrgRole] map:', map);
  //       setOwnerStatusByOrg(map);
  //     } catch (e) {
  //       console.log('[OrgRole] error memuat role per organisasi:', e);
  //       // ignore errors for now; map remains empty
  //     }
  //   }

  //   loadRoles();
  //   return () => {
  //     cancelled = true;
  //   };
  // }, [authClient, organizations]);

  // useEffect(() => {
  //   console.log('[OrgRole] ownerStatusByOrg updated:', ownerStatusByOrg);
  // }, [ownerStatusByOrg]);

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
        {isPending ? (
          <div className={cn('grid gap-4', classNames?.grid)}>
            <SkeletonViewComponent classNames={classNames} />
          </div>
        ) : (
          organizations &&
          organizations.length > 0 && (
            <div className={cn('grid gap-4', classNames?.grid)}>
              {organizations?.map((organization) => (
                <OrganizationCell
                  key={organization.id}
                  classNames={classNames}
                  localization={localization}
                  organization={organization}
                />
              ))}
            </div>
          )
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
}: AccountBaseProps & { organization: Organization | null | undefined }) {
  const { toast } = useAuth();
  const { setLastVisited } = useOrganization();

  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);
  const [isManagingOrganization, setIsManagingOrganization] = useState(false);

  const handleManageOrganization = useCallback(async () => {
    setIsManagingOrganization(true);

    try {
      setLastVisited({
        organization: organization as Organization,
        refetch: false,
        forceRedirect: true,
      });
    } catch (error) {
      toast({
        message: getLocalizedError({ error, localization }),
      });

      setIsManagingOrganization(false);
    }
  }, [organization, toast, localization, setLastVisited]);

  return (
    <>
      <Card className={cn('flex-row items-center p-4', className, classNames?.cell)}>
        <OrgView localization={localization} organization={organization} />

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
        organization={organization as Organization}
      />
    </>
  );
}
