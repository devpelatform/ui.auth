'use client';

import { useOrganization } from '@/hooks';
import { cn } from '@/lib/utils';
import { DeleteOrganizationCard } from './partials/delete-organization';
import { OrganizationLogoCard } from './partials/form-logo';
import { OrganizationNameCard } from './partials/form-name';
import { OrganizationSlugCard } from './partials/form-slug';
import type { OrganizationBaseProps } from './types';

export function OrganizationSettingsCards({
  className,
  classNames,
  localization,
}: OrganizationBaseProps) {
  const { logo } = useOrganization();

  return (
    <div className={cn('grid w-full gap-6 md:gap-8', className)}>
      {logo && <OrganizationLogoCard classNames={classNames} localization={localization} />}

      <OrganizationNameCard classNames={classNames} localization={localization} />

      <OrganizationSlugCard classNames={classNames} localization={localization} />

      <DeleteOrganizationCard classNames={classNames} localization={localization} />
    </div>
  );
}
