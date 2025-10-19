'use client';

import { useMemo, useState } from 'react';
import type { Account } from 'better-auth';
import type { SocialProvider } from 'better-auth/social-providers';
import { Loader2 } from 'lucide-react';

import { Button, Card, CardContent, Skeleton } from '@pelatform/ui/default';
import { useAuth, useAuthHooks } from '@/hooks';
import type { AuthLocalization } from '@/lib/localization';
import { socialProviders } from '@/lib/social-providers';
import { cn, getLocalizedError } from '@/lib/utils';
import type { Provider } from '@/types/components';
import type { Refetch } from '@/types/generals';
import { SettingsCard, type SettingsCardClassNames } from '../../shared/settings-card';
import { SettingsCellSkeleton } from '../../shared/settings-skeleton';

export interface ProvidersCardProps {
  className?: string;
  classNames?: SettingsCardClassNames;
  accounts?: Account[] | null;
  isPending?: boolean;
  localization?: AuthLocalization;
  skipHook?: boolean;
  refetch?: Refetch;
}

export function ProvidersCard({
  className,
  classNames,
  accounts,
  isPending,
  localization: localizationProp,
  skipHook,
  refetch,
}: ProvidersCardProps) {
  const { genericOAuth, localization: localizationContext, social } = useAuth();
  const { useListAccounts } = useAuthHooks();

  const localization = useMemo(
    () => ({ ...localizationContext, ...localizationProp }),
    [localizationContext, localizationProp],
  );

  if (!skipHook) {
    const result = useListAccounts();
    accounts = result.data as unknown as Account[];
    isPending = result.isPending;
    refetch = result.refetch;
  }

  return (
    <SettingsCard
      className={className}
      classNames={classNames}
      title={localization.PROVIDERS}
      description={localization.PROVIDERS_DESCRIPTION}
      isPending={isPending}
    >
      <CardContent className={cn('grid gap-4', classNames?.content)}>
        {isPending ? (
          social?.providers?.map((provider) => (
            <SettingsCellSkeleton key={provider} classNames={classNames} />
          ))
        ) : (
          <>
            {social?.providers?.map((provider) => {
              const socialProvider = socialProviders.find(
                (socialProvider) => socialProvider.provider === provider,
              );

              if (!socialProvider) return null;

              return (
                <ProviderCell
                  key={provider}
                  classNames={classNames}
                  account={accounts?.find((acc) => acc.providerId === provider)}
                  provider={socialProvider}
                  refetch={refetch}
                  localization={localization}
                />
              );
            })}

            {genericOAuth?.providers?.map((provider) => (
              <ProviderCell
                key={provider.provider}
                classNames={classNames}
                account={accounts?.find((acc) => acc.providerId === provider.provider)}
                provider={provider}
                refetch={refetch}
                localization={localization}
                other
              />
            ))}
          </>
        )}
      </CardContent>
    </SettingsCard>
  );
}

interface ProviderCellProps {
  className?: string;
  classNames?: SettingsCardClassNames;
  account?: Account | null;
  isPending?: boolean;
  localization: AuthLocalization;
  other?: boolean;
  provider: Provider;
  refetch?: Refetch;
}

function ProviderCell({
  className,
  classNames,
  account,
  localization,
  other,
  provider,
  refetch,
}: ProviderCellProps) {
  const { authClient, basePath, baseURL, viewPaths, toast } = useAuth();
  const { useUnlinkAccount } = useAuthHooks();
  const { mutate: unlinkAccount } = useUnlinkAccount();

  const [isLoading, setIsLoading] = useState(false);

  const handleLink = async () => {
    setIsLoading(true);
    const callbackURL = `${baseURL}${basePath}/${viewPaths.CALLBACK}?redirectTo=${window.location.pathname}`;

    try {
      if (other) {
        await authClient.oauth2.link({
          providerId: provider.provider as SocialProvider,
          callbackURL,
          fetchOptions: { throw: true },
        });
      } else {
        await authClient.linkSocial({
          provider: provider.provider as SocialProvider,
          callbackURL,
          fetchOptions: { throw: true },
        });
      }
    } catch (error) {
      toast({
        message: getLocalizedError({ error, localization }),
      });

      setIsLoading(false);
    }
  };

  const handleUnlink = async () => {
    setIsLoading(true);

    try {
      await unlinkAccount({
        accountId: account?.accountId,
        providerId: provider.provider,
      });

      await refetch?.();
    } catch (error) {
      toast({
        message: getLocalizedError({ error, localization }),
      });
    }

    setIsLoading(false);
  };

  return (
    <Card className={cn('flex-row items-center gap-3 px-4 py-3', className, classNames?.cell)}>
      {provider.icon && <provider.icon className={cn('size-4', classNames?.icon)} />}

      <div className="flex-col">
        <div className="text-sm">{provider.name}</div>

        {account && <AccountInfo account={account} />}
      </div>

      <Button
        className={cn('relative ms-auto', classNames?.button)}
        disabled={isLoading}
        size="sm"
        type="button"
        variant={account ? 'outline' : 'primary'}
        onClick={account ? handleUnlink : handleLink}
      >
        {isLoading && <Loader2 className="animate-spin" />}
        {account ? localization.UNLINK : localization.LINK}
      </Button>
    </Card>
  );
}

function AccountInfo({ account }: { account: { accountId: string } }) {
  const { useAccountInfo } = useAuthHooks();
  const { data: accountInfo, isPending } = useAccountInfo({
    accountId: account.accountId,
  });

  if (isPending) {
    return <Skeleton className="my-0.5 h-3 w-28" />;
  }

  if (!accountInfo) return null;

  return <div className="text-muted-foreground text-xs">{accountInfo?.user.email}</div>;
}
