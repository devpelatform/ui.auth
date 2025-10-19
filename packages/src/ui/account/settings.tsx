'use client';

import { useMemo } from 'react';

import { useAuth, useAuthHooks } from '@/hooks';
import type { AuthLocalization } from '@/lib/localization';
import { cn } from '@/lib/utils';
import type { SettingsCardClassNames } from '../shared/settings-card';
import { FormAvatarCard } from './partials/form-avatar';
import { FormEmailCard } from './partials/form-email';
import { FormFieldsCard } from './partials/form-fields';
import { FormNameCard } from './partials/form-name';
import { FormUsernameCard } from './partials/form-username';
import { MultiAccountCard } from './partials/multi-account';

export function SettingsCards({
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
    account: accountOptions,
    additionalFields,
    avatar,
    changeEmail,
    credentials,
    localization: localizationContext,
    multiSession,
  } = useAuth();
  const { useSession } = useAuthHooks();
  const { data: sessionData } = useSession();

  const localization = useMemo(
    () => ({ ...localizationContext, ...localizationProp }),
    [localizationContext, localizationProp],
  );

  return (
    <div className={cn('flex w-full flex-col gap-4 md:gap-6', className, classNames?.cards)}>
      {accountOptions?.fields?.includes('image') && avatar && (
        <FormAvatarCard classNames={classNames?.card} localization={localization} />
      )}

      {credentials?.username && (
        <FormUsernameCard classNames={classNames?.card} localization={localization} />
      )}

      {accountOptions?.fields?.includes('name') && (
        <FormNameCard classNames={classNames?.card} localization={localization} />
      )}

      {changeEmail && <FormEmailCard classNames={classNames?.card} localization={localization} />}

      {accountOptions?.fields?.map((field) => {
        if (field === 'image') return null;
        if (field === 'name') return null;
        const additionalField = additionalFields?.[field];
        if (!additionalField) return null;

        const {
          label,
          description,
          instructions,
          placeholder,
          required,
          type,
          multiline,
          validate,
        } = additionalField;

        // @ts-expect-error Custom fields are not typed
        const defaultValue = sessionData?.user[field] as unknown;

        return (
          <FormFieldsCard
            key={field}
            classNames={classNames?.card}
            value={defaultValue}
            description={description}
            name={field}
            instructions={instructions}
            label={label}
            localization={localization}
            placeholder={placeholder}
            required={required}
            type={type}
            multiline={multiline}
            validate={validate}
          />
        );
      })}

      {multiSession && (
        <MultiAccountCard classNames={classNames?.card} localization={localization} />
      )}
    </div>
  );
}
