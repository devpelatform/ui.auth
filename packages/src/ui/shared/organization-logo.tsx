'use client';

import { type ComponentProps, useMemo } from 'react';
import type { Organization } from 'better-auth/plugins/organization';
import { BuildingIcon } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage, Skeleton } from '@pelatform/ui/default';
import { useAuth } from '@/hooks';
import type { AuthLocalization } from '@/lib/localization';
import { cn } from '@/lib/utils';
import type { ButtonSize } from '@/types/components';

export interface OrganizationLogoClassNames {
  base?: string;
  image?: string;
  fallback?: string;
  fallbackIcon?: string;
  skeleton?: string;
}

export interface OrganizationLogoProps {
  classNames?: OrganizationLogoClassNames;
  isPending?: boolean;
  size?: ButtonSize;
  organization?: Partial<Organization> | null;
  localization?: AuthLocalization;
}

/**
 * Displays an organization logo with image and fallback support
 *
 * Renders an organization's logo image when available, with appropriate fallbacks:
 * - Shows a skeleton when isPending is true
 * - Falls back to a building icon when no logo is available
 */
export function OrganizationLogo({
  className,
  classNames,
  isPending,
  size,
  organization,
  localization: localizationProp,
  ...props
}: OrganizationLogoProps & ComponentProps<typeof Avatar>) {
  const { localization: localizationContext, avatar } = useAuth();

  const localization = useMemo(
    () => ({ ...localizationContext, ...localizationProp }),
    [localizationContext, localizationProp],
  );

  const name = organization?.name;
  const src = organization?.logo;

  if (isPending) {
    return (
      <Skeleton
        className={cn(
          'shrink-0 rounded-full',
          size === 'sm' ? 'size-6' : size === 'lg' ? 'size-10' : 'size-8',
          className,
          classNames?.base,
          classNames?.skeleton,
        )}
      />
    );
  }

  return (
    <Avatar
      className={cn(
        'bg-muted',
        size === 'sm' ? 'size-6' : size === 'lg' ? 'size-10' : 'size-8',
        className,
        classNames?.base,
      )}
      {...props}
    >
      {avatar?.Image ? (
        <avatar.Image
          src={src || ''}
          alt={name || localization?.ORGANIZATION}
          className={classNames?.image}
        />
      ) : (
        <AvatarImage
          src={src || undefined}
          alt={name || localization?.ORGANIZATION}
          className={classNames?.image}
        />
      )}

      <AvatarFallback
        className={cn('text-foreground', classNames?.fallback)}
        delayMs={src ? 600 : undefined}
      >
        <BuildingIcon className={cn('size-[50%]', classNames?.fallbackIcon)} />
      </AvatarFallback>
    </Avatar>
  );
}
