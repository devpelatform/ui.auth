'use client';

import { type ComponentProps, useMemo, useState } from 'react';
import { KeyRoundIcon } from 'lucide-react';

import {
  Button,
  Card,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Spinner,
} from '@pelatform/ui/default';
import { useAuth, useAuthHooks } from '@/hooks';
import { useLang } from '@/hooks/private';
import type { AuthLocalization } from '@/lib/localization';
import { cn, getLocalizedError } from '@/lib/utils';
import type { ApiKey, Refetch } from '@/types/generals';
import type { SettingsCardClassNames } from '../shared/settings-card';

export interface ApiKeyDeleteDialogProps extends ComponentProps<typeof Dialog> {
  classNames?: SettingsCardClassNames;
  apiKey: ApiKey;
  localization?: AuthLocalization;
  refetch?: Refetch;
}

export function ApiKeyDeleteDialog({
  classNames,
  apiKey,
  localization: localizationProp,
  refetch,
  onOpenChange,
  ...props
}: ApiKeyDeleteDialogProps) {
  const { localization: localizationContext, toast } = useAuth();
  const { useDeleteApiKey } = useAuthHooks();
  const { mutate: deleteApiKey } = useDeleteApiKey();

  const localization = useMemo(
    () => ({ ...localizationContext, ...localizationProp }),
    [localizationContext, localizationProp],
  );

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
    <Dialog onOpenChange={onOpenChange} {...props}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className={classNames?.dialog?.content}
      >
        <DialogHeader className={classNames?.dialog?.header}>
          <DialogTitle className={cn('text-lg md:text-xl', classNames?.title)}>
            {localization.DELETE} {localization.API_KEY}
          </DialogTitle>

          <DialogDescription className={cn('text-xs md:text-sm', classNames?.description)}>
            {localization.DELETE_API_KEY_CONFIRM}
          </DialogDescription>
        </DialogHeader>

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

        <DialogFooter className={classNames?.dialog?.footer}>
          <Button
            type="button"
            variant="secondary"
            onClick={() => onOpenChange?.(false)}
            disabled={isLoading}
            className={cn(classNames?.button, classNames?.secondaryButton)}
          >
            {localization.CANCEL}
          </Button>

          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
            className={cn(classNames?.button, classNames?.destructiveButton)}
          >
            {isLoading && <Spinner />}
            {localization.DELETE}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
