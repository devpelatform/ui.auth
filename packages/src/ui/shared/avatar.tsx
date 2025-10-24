'use client';

import { BuildingIcon, UserRoundIcon } from 'lucide-react';

import { getInitials } from '@pelatform/ui/components';
import { Avatar, AvatarFallback, AvatarImage, Skeleton } from '@pelatform/ui/default';
import { useAuth } from '../../hooks/main';
import { useLocalization } from '../../hooks/private';
import { getGravatarUrl } from '../../lib/images';
import { cn } from '../../lib/utils';
import type { AvatarProps } from '../../types/ui';

function getSize(size: string | null | undefined) {
  return size === 'sm' ? 'size-6' : size === 'lg' ? 'size-10' : 'size-8';
}

export function UserAvatar({
  className,
  classNames,
  isPending,
  localization: localizationProp,
  size,
  user,
  ...props
}: AvatarProps) {
  const { gravatar } = useAuth();

  const localization = useLocalization(localizationProp);

  const name =
    user?.displayName ||
    user?.name ||
    user?.fullName ||
    user?.firstName ||
    user?.displayUsername ||
    user?.username ||
    user?.email;
  const userImage = user?.image || user?.avatar || user?.avatarUrl;

  // Calculate gravatar URL synchronously
  const gravatarUrl =
    gravatar && user?.email
      ? getGravatarUrl(user.email, gravatar === true ? undefined : gravatar)
      : null;

  const src = gravatar ? gravatarUrl : userImage;

  if (isPending) {
    return (
      <Skeleton
        className={cn(
          'shrink-0 rounded-full',
          getSize(size),
          className,
          classNames?.base,
          classNames?.skeleton,
        )}
      />
    );
  }

  return (
    <Avatar
      className={cn('rounded-full bg-accent', getSize(size), className, classNames?.base)}
      {...props}
    >
      <AvatarImage
        src={src || undefined}
        alt={name || localization.USER}
        className={classNames?.image}
      />

      <AvatarFallback
        className={cn('text-foreground uppercase', classNames?.fallback)}
        delayMs={src ? 600 : undefined}
      >
        {getInitials(name, 2) || (
          <UserRoundIcon className={cn('size-[50%]', classNames?.fallbackIcon)} />
        )}
      </AvatarFallback>
    </Avatar>
  );
}

export function OrganizationLogo({
  className,
  classNames,
  isPending,
  localization: localizationProp,
  organization,
  size,
  ...props
}: AvatarProps) {
  const localization = useLocalization(localizationProp);

  const name = organization?.name;
  const src = organization?.logo;

  if (isPending) {
    return (
      <Skeleton
        className={cn(
          'shrink-0 rounded-full',
          getSize(size),
          className,
          classNames?.base,
          classNames?.skeleton,
        )}
      />
    );
  }

  return (
    <Avatar
      className={cn('rounded-full bg-accent', getSize(size), className, classNames?.base)}
      {...props}
    >
      <AvatarImage
        src={src || undefined}
        alt={name || localization.ORGANIZATION}
        className={classNames?.image}
      />

      <AvatarFallback
        className={cn('text-foreground', classNames?.fallback)}
        delayMs={src ? 600 : undefined}
      >
        <BuildingIcon className={cn('size-[50%]', classNames?.fallbackIcon)} />
      </AvatarFallback>
    </Avatar>
  );
}
