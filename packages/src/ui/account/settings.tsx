'use client';

import { useAuth, useAuthHooks } from '../../hooks/index';
import { useLocalization } from '../../hooks/private';
import { cn } from '../../lib/utils';
import { DisplayIdCard } from '../shared/display-id';
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
    displayId,
    multiSession,
  } = useAuth();
  const { data: sessionData, isPending } = useAuthHooks().useSession();

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

      {displayId && (
        <DisplayIdCard
          classNames={classNames}
          localization={localization}
          isPending={!sessionData?.user || isPending}
          id={sessionData?.user?.id}
          title={localization.DISPLAY_USER_TITLE}
          description={localization.DISPLAY_USER_DESCRIPTION}
        />
      )}

      {multiSession && <MultiAccountCard classNames={classNames} localization={localization} />}
    </div>
  );
}
