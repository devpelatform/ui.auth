'use client';

import { useState } from 'react';

import { Button, Card, Spinner } from '@pelatform/ui/default';
import { useAuth } from '../../hooks/main';
import { useLocalization } from '../../hooks/private';
import { useDeleteApiKey } from '../../hooks/use-delete-api-key';
import { cn, getLocalizedError } from '../../lib/utils';
import type { ApiKey, Refetch } from '../../types/generals';
import type { DialogComponentProps } from '../../types/ui';
import { DialogComponent } from '../shared/components/dialog';
import { ApiKeyView } from '../shared/view';

export function ApiKeyDeleteDialog({
  classNames,
  localization: localizationProp,
  onOpenChange,
  title,
  description,
  apiKey,
  refetch,
  ...props
}: DialogComponentProps & { apiKey: ApiKey; refetch?: Refetch }) {
  const { toast } = useAuth();
  const { mutate: deleteApiKey } = useDeleteApiKey();

  const localization = useLocalization(localizationProp);

  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);

    try {
      await deleteApiKey({ keyId: apiKey.id });
      await refetch?.();
      onOpenChange?.(false);
    } catch (error) {
      toast({ message: getLocalizedError({ error, localization }) });
    }

    setIsLoading(false);
  };

  return (
    <DialogComponent
      classNames={classNames}
      localization={localization}
      onOpenChange={onOpenChange}
      title={title || `${localization.DELETE} ${localization.API_KEY}`}
      description={description || localization.DELETE_API_KEY_CONFIRM}
      cancelButton={true}
      cancelButtonDisabled={isLoading}
      button={
        <Button
          type="button"
          variant="destructive"
          className={cn(classNames?.button, classNames?.destructiveButton)}
          onClick={handleDelete}
          disabled={isLoading}
        >
          {isLoading && <Spinner />}
          {localization.DELETE}
        </Button>
      }
      {...props}
    >
      <Card className={cn('my-2 flex-row items-center gap-3 px-4 py-3', classNames?.cell)}>
        <ApiKeyView apiKey={apiKey} classNames={{ icon: classNames?.icon }} />
      </Card>
    </DialogComponent>
  );
}
