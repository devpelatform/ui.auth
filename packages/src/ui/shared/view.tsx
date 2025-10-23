'use client';

import { KeyRoundIcon } from 'lucide-react';

import { Skeleton } from '@pelatform/ui/default';
import { useLang, useLocalization } from '@/hooks/private';
import { cn } from '@/lib/utils';
import type { ApiKey, Profile } from '@/types/generals';
import type { ViewProps } from '@/types/ui';
import { OrganizationLogo, UserAvatar } from './avatar';

function getName(user: Profile | null | undefined) {
  return (
    user?.displayName ||
    user?.name ||
    user?.fullName ||
    user?.firstName ||
    user?.displayUsername ||
    user?.username ||
    user?.email
  );
}

export function UserView({
  className,
  classNames,
  isPending,
  localization: localizationProp,
  size,
  user,
}: ViewProps) {
  const localization = useLocalization(localizationProp);

  return (
    <div className={cn('flex items-center gap-2', className, classNames?.base)}>
      <UserAvatar
        className={cn(size !== 'sm' && 'my-0.5')}
        classNames={classNames?.avatar}
        isPending={isPending}
        localization={localization}
        size={size}
        user={user}
      />

      <div className={cn('grid flex-1 text-start leading-tight', classNames?.content)}>
        {isPending ? (
          <>
            <Skeleton
              className={cn(
                'max-w-full',
                size === 'lg' ? 'h-4.5 w-32' : 'h-3.5 w-24',
                classNames?.title,
                classNames?.skeleton,
              )}
            />

            {size !== 'sm' && (
              <Skeleton
                className={cn(
                  'mt-1.5 max-w-full',
                  size === 'lg' ? 'h-3.5 w-40' : 'h-3 w-32',
                  classNames?.subtitle,
                  classNames?.skeleton,
                )}
              />
            )}
          </>
        ) : (
          <>
            <span
              className={cn(
                'truncate font-semibold',
                size === 'lg' ? 'text-base' : 'text-sm',
                classNames?.title,
              )}
            >
              {getName(user) || localization.USER}
            </span>

            {!user?.isAnonymous && size !== 'sm' && (user?.name || user?.username) && (
              <span
                className={cn(
                  'truncate opacity-70',
                  size === 'lg' ? 'text-sm' : 'text-xs',
                  classNames?.subtitle,
                )}
              >
                {user?.email}
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export function PersonalAccountView({
  className,
  classNames,
  isPending,
  localization: localizationProp,
  size,
  user,
}: ViewProps) {
  const localization = useLocalization(localizationProp);

  return (
    <div className={cn('flex items-center gap-2', className, classNames?.base)}>
      <UserAvatar
        className={cn(size !== 'sm' && 'my-0.5')}
        classNames={classNames?.avatar}
        isPending={isPending}
        localization={localization}
        size={size}
        user={user}
      />

      <div className={cn('grid flex-1 text-start leading-tight', classNames?.content)}>
        {isPending ? (
          <>
            <Skeleton
              className={cn(
                'max-w-full',
                size === 'lg' ? 'h-4.5 w-32' : 'h-3.5 w-24',
                classNames?.title,
                classNames?.skeleton,
              )}
            />

            {size !== 'sm' && (
              <Skeleton
                className={cn(
                  'mt-1.5 max-w-full',
                  size === 'lg' ? 'h-3.5 w-40' : 'h-3 w-32',
                  classNames?.subtitle,
                  classNames?.skeleton,
                )}
              />
            )}
          </>
        ) : (
          <>
            <span
              className={cn(
                'truncate font-semibold',
                size === 'lg' ? 'text-base' : 'text-sm',
                classNames?.title,
              )}
            >
              {getName(user) || localization.USER}
            </span>

            {size !== 'sm' && (
              <span
                className={cn(
                  'truncate opacity-70',
                  size === 'lg' ? 'text-sm' : 'text-xs',
                  classNames?.subtitle,
                )}
              >
                {localization.PERSONAL_ACCOUNT}
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export function OrgView({
  className,
  classNames,
  isPending,
  localization: localizationProp,
  organization,
  size,
}: ViewProps) {
  const localization = useLocalization(localizationProp);

  return (
    <div className={cn('flex items-center gap-2 truncate', className, classNames?.base)}>
      <OrganizationLogo
        className={cn(size !== 'sm' && 'my-0.5')}
        classNames={classNames?.avatar}
        isPending={isPending}
        localization={localization}
        organization={organization}
        size={size}
      />

      <div className={cn('flex flex-col truncate text-start leading-tight', classNames?.content)}>
        {isPending ? (
          <>
            <Skeleton
              className={cn(
                'max-w-full',
                size === 'lg' ? 'h-4.5 w-32' : 'h-3.5 w-24',
                classNames?.title,
                classNames?.skeleton,
              )}
            />

            {size !== 'sm' && (
              <Skeleton
                className={cn(
                  'mt-1.5 max-w-full',
                  size === 'lg' ? 'h-3.5 w-24' : 'h-3 w-16',
                  classNames?.subtitle,
                  classNames?.skeleton,
                )}
              />
            )}
          </>
        ) : (
          <>
            <span
              className={cn(
                'truncate font-semibold',
                size === 'lg' ? 'text-base' : 'text-sm',
                classNames?.title,
              )}
            >
              {organization?.name || localization.ORGANIZATION}
            </span>

            {size !== 'sm' && organization?.slug && (
              <span
                className={cn(
                  'truncate opacity-70',
                  size === 'lg' ? 'text-sm' : 'text-xs',
                  classNames?.subtitle,
                )}
              >
                {organization.slug}
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export function ApiKeyView({
  className,
  classNames,
  localization: localizationProp,
  apiKey,
}: ViewProps & { apiKey: ApiKey }) {
  const localization = useLocalization(localizationProp);
  const { lang } = useLang();

  // Format expiration date or show "Never expires"
  const formatExpiration = () => {
    if (!apiKey.expiresAt) return localization?.NEVER_EXPIRES;

    const expiresDate = new Date(apiKey.expiresAt);
    return `${localization?.EXPIRES} ${expiresDate.toLocaleDateString(lang ?? 'en', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })}`;
  };

  return (
    <div className={cn('flex items-center gap-3 truncate', className, classNames?.base)}>
      <KeyRoundIcon className={cn('size-4 shrink-0', classNames?.icon)} />

      <div className="flex flex-col truncate text-start">
        <div className="flex items-center gap-2">
          <span className="truncate font-semibold text-sm">{apiKey.name}</span>
          <span className="flex-1 truncate text-muted-foreground text-sm">
            {apiKey.start}
            {'******'}
          </span>
        </div>

        <div className="truncate text-muted-foreground text-xs">{formatExpiration()}</div>
      </div>
    </div>
  );
}
