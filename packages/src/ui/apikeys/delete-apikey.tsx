'use client';

import { useState } from 'react';
import { KeyRoundIcon } from 'lucide-react';

import { Button, Card, Spinner } from '@pelatform/ui/default';
import { useAuth, useAuthHooks } from '@/hooks';
import { useLang, useLocalization } from '@/hooks/private';
import { cn, getLocalizedError } from '@/lib/utils';
import type { ApiKey, Refetch } from '@/types/generals';
import type { DialogComponentProps } from '@/types/ui';
import { DialogComponent } from '../shared/components/dialog';

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
  const { useDeleteApiKey } = useAuthHooks();
  const { mutate: deleteApiKey } = useDeleteApiKey();

  const localization = useLocalization(localizationProp);

  const { lang } = useLang();
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
        <KeyRoundIcon className={cn('size-4', classNames?.icon)} />
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">{apiKey.name}</span>
            <span className="text-muted-foreground text-sm">
              {apiKey.start}
              {'******'}
            </span>
          </div>
          <div className="text-muted-foreground text-xs">{formatExpiration()}</div>
        </div>
      </Card>
    </DialogComponent>
  );
}
