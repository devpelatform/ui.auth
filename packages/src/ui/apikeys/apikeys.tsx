'use client';

import { useMemo, useState } from 'react';
import type { Organization } from 'better-auth/plugins/organization';
import { KeyRoundIcon } from 'lucide-react';

import { Button, Card, CardContent } from '@pelatform/ui/default';
import { useAuth, useAuthHooks } from '@/hooks';
import { useLang } from '@/hooks/private';
import type { AuthLocalization } from '@/lib/localization';
import { cn } from '@/lib/utils';
import type { ApiKey, Refetch } from '@/types/generals';
import {
  SettingsCard,
  type SettingsCardClassNames,
  type SettingsCardProps,
} from '../shared/settings-card';
import { CreateApiKeyDialog } from './create-apikey';
import { ApiKeyDeleteDialog } from './delete-apikey';
import { ApiKeyDisplayDialog } from './display-apikey';
// import { CreateApiKeyDialogOrg } from './create-apikey-org';

export interface ApiKeysCardProps extends SettingsCardProps {
  organizations?: Organization[] | null | undefined;
  organizationId?: string;
}

export function ApiKeysCard({
  className,
  classNames,
  localization: localizationProp,
  organizations,
  organizationId,
  ...props
}: ApiKeysCardProps) {
  const { localization: localizationContext } = useAuth();
  const { useListApiKeys } = useAuthHooks();
  const { data: apiKeys, isPending, refetch } = useListApiKeys();

  const localization = useMemo(
    () => ({ ...localizationContext, ...localizationProp }),
    [localizationContext, localizationProp],
  );

  // Filter API keys by organizationId
  const filteredApiKeys = useMemo(() => {
    return apiKeys?.filter((apiKey) => organizationId === apiKey.metadata?.organizationId);
  }, [apiKeys, organizationId]);

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [displayDialogOpen, setDisplayDialogOpen] = useState(false);
  const [createdApiKey, setCreatedApiKey] = useState('');

  const handleCreateApiKey = (apiKey: string) => {
    setCreatedApiKey(apiKey);
    setDisplayDialogOpen(true);
  };

  return (
    <>
      <SettingsCard
        className={className}
        classNames={classNames}
        actionLabel={localization.CREATE_API_KEY}
        description={localization.API_KEYS_DESCRIPTION}
        instructions={localization.API_KEYS_INSTRUCTIONS}
        isPending={isPending}
        title={localization.API_KEYS}
        action={() => setCreateDialogOpen(true)}
        {...props}
      >
        {filteredApiKeys && filteredApiKeys.length > 0 && (
          <CardContent className={cn('grid gap-4', classNames?.content)}>
            {filteredApiKeys?.map((apiKey) => (
              <ApiKeyCell
                key={apiKey.id}
                classNames={classNames}
                apiKey={apiKey}
                localization={localization}
                refetch={refetch}
              />
            ))}
          </CardContent>
        )}
      </SettingsCard>

      {organizations && organizations.length > 0 ? (
        // <CreateApiKeyDialogOrg
        //   classNames={classNames}
        //   localization={localization}
        //   open={createDialogOpen}
        //   onOpenChange={setCreateDialogOpen}
        //   onSuccess={handleCreateApiKey}
        //   refetch={refetch}
        //   organizationId={organizationId}
        // />
        <>Nothing to see here</>
      ) : (
        <CreateApiKeyDialog
          classNames={classNames}
          localization={localization}
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          onSuccess={handleCreateApiKey}
          refetch={refetch}
        />
      )}

      <ApiKeyDisplayDialog
        classNames={classNames}
        apiKey={createdApiKey}
        localization={localization}
        open={displayDialogOpen}
        onOpenChange={setDisplayDialogOpen}
      />
    </>
  );
}

interface ApiKeyCellProps {
  className?: string;
  classNames?: SettingsCardClassNames;
  apiKey: ApiKey;
  localization: AuthLocalization;
  refetch?: Refetch;
}

function ApiKeyCell({ className, classNames, apiKey, localization, refetch }: ApiKeyCellProps) {
  const { lang } = useLang();

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Format expiration date or show "Never expires"
  const formatExpiration = () => {
    if (!apiKey.expiresAt) return localization.NEVER_EXPIRES;

    const expiresDate = new Date(apiKey.expiresAt);
    return `${localization.EXPIRES} ${expiresDate.toLocaleDateString(lang ?? 'en', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })}`;
  };

  return (
    <>
      <Card
        className={cn(
          'flex-row items-center gap-3 truncate px-4 py-3',
          className,
          classNames?.cell,
        )}
      >
        <KeyRoundIcon className={cn('size-4 flex-shrink-0', classNames?.icon)} />

        <div className="flex flex-col truncate">
          <div className="flex items-center gap-2">
            <span className="truncate font-semibold text-sm">{apiKey.name}</span>

            <span className="flex-1 truncate text-muted-foreground text-sm">
              {apiKey.start}
              {'******'}
            </span>
          </div>

          <div className="truncate text-muted-foreground text-xs">{formatExpiration()}</div>
        </div>

        <Button
          className={cn('relative ms-auto', classNames?.button, classNames?.outlineButton)}
          size="sm"
          variant="outline"
          onClick={() => setShowDeleteDialog(true)}
        >
          {localization.DELETE}
        </Button>
      </Card>

      <ApiKeyDeleteDialog
        classNames={classNames}
        apiKey={apiKey}
        localization={localization}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        refetch={refetch}
      />
    </>
  );
}
