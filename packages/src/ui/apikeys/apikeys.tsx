'use client';

import { useMemo, useState } from 'react';
import type { Organization } from 'better-auth/plugins/organization';
import { KeyRoundIcon } from 'lucide-react';

import { Button, Card } from '@pelatform/ui/default';
import { useAuthHooks } from '@/hooks';
import { useLang, useLocalization } from '@/hooks/private';
import { cn } from '@/lib/utils';
import type { ApiKey, Refetch } from '@/types/generals';
import type { CardComponentProps } from '@/types/ui';
import { CardComponent } from '../shared/components/card';
import { CreateApiKeyDialog } from './create-apikey';
import { ApiKeyDeleteDialog } from './delete-apikey';
import { ApiKeyDisplayDialog } from './display-apikey';

export function ApiKeysCard({
  className,
  classNames,
  localization: localizationProp,
  isOrganization = false,
  organization,
  organizationId,
  ...props
}: CardComponentProps & {
  isOrganization?: boolean;
  organization?: Organization | null | undefined;
  organizationId?: string;
}) {
  const { useListApiKeys } = useAuthHooks();
  const { data: apiKeys, isPending, refetch } = useListApiKeys();

  const localization = useLocalization(localizationProp);

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
      <CardComponent
        className={className}
        classNames={classNames}
        title={localization.API_KEYS}
        description={localization.API_KEYS_DESCRIPTION}
        instructions={localization.API_KEYS_INSTRUCTIONS}
        actionLabel={localization.CREATE_API_KEY}
        action={() => setCreateDialogOpen(true)}
        isPending={isPending}
        {...props}
      >
        {filteredApiKeys && filteredApiKeys.length > 0 && (
          <div className={cn('grid gap-4', classNames?.grid)}>
            {filteredApiKeys?.map((apiKey) => (
              <ApiKeyCell
                key={apiKey.id}
                classNames={classNames}
                apiKey={apiKey}
                localization={localization}
                refetch={refetch}
              />
            ))}
          </div>
        )}
      </CardComponent>

      {isOrganization && organization && organizationId && (
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
      )}

      {!isOrganization && (
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
        localization={localization}
        open={displayDialogOpen}
        onOpenChange={setDisplayDialogOpen}
        apiKey={createdApiKey}
      />
    </>
  );
}

function ApiKeyCell({
  className,
  classNames,
  localization,
  apiKey,
  refetch,
}: CardComponentProps & { apiKey: ApiKey; refetch?: Refetch }) {
  const { lang } = useLang();

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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
    <>
      <Card
        className={cn(
          'flex-row items-center gap-3 truncate px-4 py-3',
          className,
          classNames?.cell,
        )}
      >
        <KeyRoundIcon className={cn('size-4 shrink-0', classNames?.icon)} />

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
          size="sm"
          variant="outline"
          className={cn('relative ms-auto', classNames?.button, classNames?.outlineButton)}
          onClick={() => setShowDeleteDialog(true)}
        >
          {localization?.DELETE}
        </Button>
      </Card>

      <ApiKeyDeleteDialog
        classNames={classNames}
        localization={localization}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        apiKey={apiKey}
        refetch={refetch}
      />
    </>
  );
}
