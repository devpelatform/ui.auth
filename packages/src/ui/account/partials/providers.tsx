'use client';

import { useState } from 'react';

import { Button, Card, Skeleton, Spinner } from '@pelatform/ui/default';
import { useAuth } from '../../../hooks/main';
import { useLocalization } from '../../../hooks/private';
import { useAccountInfo } from '../../../hooks/use-account-info';
import { useListAccounts } from '../../../hooks/use-list-accounts';
import { useUnlinkAccount } from '../../../hooks/use-unlink-account';
import { socialProviders } from '../../../lib/social-providers';
import { cn, getLocalizedError } from '../../../lib/utils';
import type { Account, SocialProvider } from '../../../types/auth';
import type { Provider } from '../../../types/components';
import type { Refetch } from '../../../types/generals';
import type { CardComponentProps } from '../../../types/ui';
import { CardComponent } from '../../shared/components/card';
import { SkeletonViewComponent } from '../../shared/components/skeleton';

export function ProvidersCard({
  className,
  classNames,
  isPending,
  localization: localizationProp,
  accounts,
  refetch,
  skipHook,
  ...props
}: CardComponentProps & {
  accounts?: Account[] | null;
  refetch?: Refetch;
  skipHook?: boolean;
}) {
  const { genericOAuth, social } = useAuth();

  const localization = useLocalization(localizationProp);

  if (!skipHook) {
    const result = useListAccounts();
    accounts = result.data as unknown as Account[];
    isPending = result.isPending;
    refetch = result.refetch;
  }

  return (
    <CardComponent
      className={className}
      classNames={classNames}
      title={localization.PROVIDERS}
      description={localization.PROVIDERS_DESCRIPTION}
      isPending={isPending}
      {...props}
    >
      <div className={cn('grid gap-4', classNames?.grid)}>
        {isPending ? (
          social?.providers?.map((provider) => (
            <SkeletonViewComponent key={provider} classNames={classNames} />
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
                  localization={localization}
                  account={accounts?.find((acc) => acc.providerId === provider)}
                  provider={socialProvider}
                  refetch={refetch}
                />
              );
            })}

            {genericOAuth?.providers?.map((provider) => (
              <ProviderCell
                key={provider.provider}
                classNames={classNames}
                localization={localization}
                account={accounts?.find((acc) => acc.providerId === provider.provider)}
                provider={provider}
                refetch={refetch}
                other
              />
            ))}
          </>
        )}
      </div>
    </CardComponent>
  );
}

function ProviderCell({
  className,
  classNames,
  localization,
  account,
  other,
  provider,
  refetch,
}: CardComponentProps & {
  account?: Account | null;
  other?: boolean;
  provider: Provider;
  refetch?: Refetch;
}) {
  const { authClient, basePath, baseURL, viewPaths, toast } = useAuth();
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
    <Card className={cn('flex-row items-center p-4', className, classNames?.cell)}>
      <div className="flex items-center gap-3">
        {provider.icon && <provider.icon className={cn('size-4', classNames?.icon)} />}

        <div className="flex-col">
          <div className="text-sm">{provider.name}</div>
          {account && <AccountInfo account={account} />}
        </div>
      </div>

      <Button
        type="button"
        variant={account ? 'outline' : 'primary'}
        size="sm"
        className={cn('relative ms-auto', classNames?.button)}
        onClick={account ? handleUnlink : handleLink}
        disabled={isLoading}
      >
        {isLoading && <Spinner />}
        {account ? localization?.UNLINK : localization?.LINK}
      </Button>
    </Card>
  );
}

function AccountInfo({ account }: { account: { accountId: string } }) {
  const { data: accountInfo, isPending } = useAccountInfo({
    accountId: account.accountId,
  });

  if (isPending) {
    return <Skeleton className="my-0.5 h-3 w-28" />;
  }

  if (!accountInfo) return null;

  return <div className="text-muted-foreground text-xs">{accountInfo?.user.email}</div>;
}
