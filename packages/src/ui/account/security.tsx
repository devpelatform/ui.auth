'use client';

import { useAuth } from '../../hooks/main';
import { useLocalization } from '../../hooks/private';
import { useListAccounts } from '../../hooks/use-list-accounts';
import { cn } from '../../lib/utils';
import type { Account } from '../../types/auth';
import { DeleteAccountCard } from './partials/delete-account';
import { FormPasswordCard } from './partials/form-password';
import { PasskeysCard } from './partials/passkeys';
import { ProvidersCard } from './partials/providers';
import { SessionsCard } from './partials/sessions';
import { TwoFactorCard } from './partials/two-factor';
import type { AccountBaseProps } from './types';

export function SecurityCards({
  className,
  classNames,
  localization: localizationProp,
}: AccountBaseProps) {
  const { credentials, deleteUser, genericOAuth, passkey, social, twoFactor } = useAuth();
  const { data, isPending: accountsPending, refetch: refetchAccounts } = useListAccounts();

  const localization = useLocalization(localizationProp);

  const accounts = data as unknown as Account[];

  const credentialsLinked = accounts?.some((acc) => acc.providerId === 'credential');

  return (
    <div className={cn('grid w-full gap-6 md:gap-8', className)}>
      {credentials && (
        <FormPasswordCard
          classNames={classNames}
          isPending={accountsPending}
          localization={localization}
          accounts={accounts}
          skipHook
        />
      )}

      {(social?.providers?.length || genericOAuth?.providers?.length) && (
        <ProvidersCard
          classNames={classNames}
          isPending={accountsPending}
          localization={localization}
          accounts={accounts}
          refetch={refetchAccounts}
          skipHook
        />
      )}

      {twoFactor && credentialsLinked && (
        <TwoFactorCard classNames={classNames} localization={localization} />
      )}

      {passkey && <PasskeysCard classNames={classNames} localization={localization} />}

      <SessionsCard classNames={classNames} localization={localization} />

      {deleteUser && (
        <DeleteAccountCard
          classNames={classNames}
          isPending={accountsPending}
          localization={localization}
          accounts={accounts}
          skipHook
        />
      )}
    </div>
  );
}
