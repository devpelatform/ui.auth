'use client';

import { useMemo } from 'react';
import type { Account } from 'better-auth';

import { useAuth, useAuthHooks } from '@/hooks';
import type { AuthLocalization } from '@/lib/localization';
import { cn } from '@/lib/utils';
import type { SettingsCardClassNames } from '../shared/settings-card';
import { DeleteAccountCard } from './partials/delete-account';
import { FormPasswordCard } from './partials/form-password';
import { PasskeysCard } from './partials/passkeys';
import { ProvidersCard } from './partials/providers';
import { SessionsCard } from './partials/sessions';
import { TwoFactorCard } from './partials/two-factor';

export function SecurityCards({
  className,
  classNames,
  localization: localizationProp,
}: {
  className?: string;
  classNames?: {
    card?: SettingsCardClassNames;
    cards?: string;
  };
  localization?: AuthLocalization;
}) {
  const {
    credentials,
    deleteUser,
    genericOAuth,
    localization: localizationContext,
    passkey,
    social,
    twoFactor,
  } = useAuth();
  const { useListAccounts } = useAuthHooks();
  const { data, isPending: accountsPending, refetch: refetchAccounts } = useListAccounts();

  const localization = useMemo(
    () => ({ ...localizationContext, ...localizationProp }),
    [localizationContext, localizationProp],
  );

  const accounts = data as unknown as Account[];

  const credentialsLinked = accounts?.some((acc) => acc.providerId === 'credential');

  return (
    <div className={cn('flex w-full flex-col gap-4 md:gap-6', className, classNames?.cards)}>
      {credentials && (
        <FormPasswordCard
          accounts={accounts}
          classNames={classNames?.card}
          isPending={accountsPending}
          localization={localization}
          skipHook
        />
      )}

      {(social?.providers?.length || genericOAuth?.providers?.length) && (
        <ProvidersCard
          accounts={accounts}
          classNames={classNames?.card}
          isPending={accountsPending}
          localization={localization}
          refetch={refetchAccounts}
          skipHook
        />
      )}

      {twoFactor && credentialsLinked && (
        <TwoFactorCard classNames={classNames?.card} localization={localization} />
      )}

      {passkey && <PasskeysCard classNames={classNames?.card} localization={localization} />}

      <SessionsCard classNames={classNames?.card} localization={localization} />

      {deleteUser && (
        <DeleteAccountCard
          accounts={accounts}
          classNames={classNames?.card}
          isPending={accountsPending}
          localization={localization}
          skipHook
        />
      )}
    </div>
  );
}
