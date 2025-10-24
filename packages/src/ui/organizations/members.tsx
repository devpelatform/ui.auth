'use client';

import { useLocalization } from '../../hooks/private';
import { cn } from '../../lib/utils';
import { OrganizationInvitationsCard } from './partials/invitations';
import { OrganizationMemberCard } from './partials/member';
import type { OrganizationBaseProps } from './types';

export function OrganizationMembersCards({
  className,
  classNames,
  localization: localizationProp,
}: OrganizationBaseProps) {
  const localization = useLocalization(localizationProp);

  return (
    <div className={cn('grid w-full gap-6 md:gap-8', className)}>
      <OrganizationMemberCard classNames={classNames} localization={localization} />

      <OrganizationInvitationsCard classNames={classNames} localization={localization} />
    </div>
  );
}
