'use client';

import { useAuth, useAuthHooks } from '@/hooks';
import { useLocalization } from '@/hooks/private';
import { cn } from '@/lib/utils';
import { FormAvatarCard } from './partials/form-avatar';
import { FormEmailCard } from './partials/form-email';
import { FormFieldsCard } from './partials/form-fields';
import { FormNameCard } from './partials/form-name';
import { FormUsernameCard } from './partials/form-username';
import { MultiAccountCard } from './partials/multi-account';
import type { AccountBaseProps } from './types';

export function SettingsCards({
  className,
  classNames,
  localization: localizationProp,
}: AccountBaseProps) {
  const {
    account: accountOptions,
    additionalFields,
    avatar,
    changeEmail,
    credentials,
    multiSession,
  } = useAuth();
  const { useSession } = useAuthHooks();
  const { data: sessionData } = useSession();

  const localization = useLocalization(localizationProp);

  return (
    <div className={cn('grid w-full gap-6 md:gap-8', className)}>
      {accountOptions?.fields?.includes('image') && avatar && (
        <FormAvatarCard classNames={classNames} localization={localization} />
      )}

      {credentials?.username && (
        <FormUsernameCard classNames={classNames} localization={localization} />
      )}

      {accountOptions?.fields?.includes('name') && (
        <FormNameCard classNames={classNames} localization={localization} />
      )}

      {changeEmail && <FormEmailCard classNames={classNames} localization={localization} />}

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
            classNames={classNames}
            description={description}
            instructions={instructions}
            localization={localization}
            name={field}
            placeholder={placeholder}
            required={required}
            label={label}
            type={type}
            multiline={multiline}
            value={defaultValue}
            validate={validate}
          />
        );
      })}

      {multiSession && <MultiAccountCard classNames={classNames} localization={localization} />}
    </div>
  );
}
