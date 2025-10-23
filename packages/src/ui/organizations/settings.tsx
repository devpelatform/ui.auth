'use client';

import { useOrganization } from '../../hooks/index';
import { useLocalization } from '../../hooks/private';
import { cn } from '../../lib/utils';
import { DisplayIdCard } from '../shared/display-id';
import { DeleteOrganizationCard } from './partials/delete-organization';
import { OrganizationLogoCard } from './partials/form-logo';
import { OrganizationNameCard } from './partials/form-name';
import { OrganizationSlugCard } from './partials/form-slug';
import type { OrganizationBaseProps } from './types';

export function OrganizationSettingsCards({
  className,
  classNames,
  localization: localizationProp,
}: OrganizationBaseProps) {
  const { data, displayId, isPending, logo } = useOrganization();

  const localization = useLocalization(localizationProp);

  return (
    <div className={cn('grid w-full gap-6 md:gap-8', className)}>
      {logo && <OrganizationLogoCard classNames={classNames} localization={localization} />}

      <OrganizationNameCard classNames={classNames} localization={localization} />

      <OrganizationSlugCard classNames={classNames} localization={localization} />

      {displayId && (
        <DisplayIdCard
          classNames={classNames}
          localization={localization}
          isPending={!data || isPending}
          id={data?.id}
          title={localization.DISPLAY_ORGANIZATION_TITLE}
          description={localization.DISPLAY_ORGANIZATION_DESCRIPTION}
        />
      )}

      <DeleteOrganizationCard classNames={classNames} localization={localization} />
    </div>
  );
}
