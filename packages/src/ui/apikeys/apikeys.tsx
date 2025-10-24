'use client';

import { useMemo, useState } from 'react';

import { Button, Card } from '@pelatform/ui/default';
import { useLocalization } from '../../hooks/private';
import { useListApiKeys } from '../../hooks/use-list-api-keys';
import { cn } from '../../lib/utils';
import type { ApiKey, Refetch } from '../../types/generals';
import type { CardComponentProps } from '../../types/ui';
import { CardComponent } from '../shared/components/card';
import { SkeletonViewComponent } from '../shared/components/skeleton';
import { ApiKeyView } from '../shared/view';
import { CreateApiKeyDialog } from './create-apikey';
import { ApiKeyDeleteDialog } from './delete-apikey';
import { ApiKeyDisplayDialog } from './display-apikey';

export function ApiKeysCard({
  className,
  classNames,
  isPending: organizationPending,
  localization: localizationProp,
  isOrganization = false,
  organizationId,
  ...props
}: CardComponentProps & {
  isOrganization?: boolean;
  organizationId?: string;
}) {
  const { data: apiKeys, isPending: apiKeyPending, refetch } = useListApiKeys();

  const localization = useLocalization(localizationProp);

  const isPending = apiKeyPending || (isOrganization && organizationPending);

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
        {isPending ? (
          <div className={cn('grid gap-4', classNames?.grid)}>
            <SkeletonViewComponent classNames={classNames} />
          </div>
        ) : (
          filteredApiKeys &&
          filteredApiKeys.length > 0 && (
            <div className={cn('grid gap-4', classNames?.grid)}>
              {filteredApiKeys?.map((apiKey) => (
                <ApiKeyCell
                  key={apiKey.id}
                  classNames={classNames}
                  localization={localization}
                  apiKey={apiKey}
                  refetch={refetch}
                />
              ))}
            </div>
          )
        )}
      </CardComponent>

      <CreateApiKeyDialog
        classNames={classNames}
        localization={localization}
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={handleCreateApiKey}
        refetch={refetch}
        isOrganization={isOrganization}
        organizationId={organizationId}
      />

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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <>
      <Card className={cn('flex-row p-4', className, classNames?.cell)}>
        <ApiKeyView apiKey={apiKey} classNames={{ icon: classNames?.icon }} />

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
