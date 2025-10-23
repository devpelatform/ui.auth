'use client';

import { CheckIcon, CopyIcon } from 'lucide-react';

import { Button } from '@pelatform/ui/default';
import { useCopyToClipboard } from '@pelatform/ui/hooks';
import { useLocalization } from '@/hooks/private';
import { cn } from '@/lib/utils';
import type { DialogComponentProps } from '@/types/ui';
import { DialogComponent } from '../shared/components/dialog';

export function ApiKeyDisplayDialog({
  classNames,
  localization: localizationProp,
  onOpenChange,
  title,
  description,
  apiKey,
  ...props
}: DialogComponentProps & { apiKey: string }) {
  const localization = useLocalization(localizationProp);

  const { copy, copied } = useCopyToClipboard();

  return (
    <DialogComponent
      classNames={classNames}
      localization={localization}
      onOpenChange={onOpenChange}
      title={title || localization.API_KEY_CREATED}
      description={description || localization.CREATE_API_KEY_SUCCESS}
      button={
        <>
          <Button
            type="button"
            variant="outline"
            className={cn(classNames?.button, classNames?.outlineButton)}
            onClick={() => copy(apiKey)}
            disabled={copied}
          >
            {copied ? (
              <>
                <CheckIcon className={cn('stroke-green-600', classNames?.icon)} />
                {localization.COPIED_TO_CLIPBOARD}
              </>
            ) : (
              <>
                <CopyIcon className={classNames?.icon} />
                {localization.COPY_TO_CLIPBOARD}
              </>
            )}
          </Button>
          <Button
            type="button"
            className={cn(classNames?.button, classNames?.primaryButton)}
            onClick={() => onOpenChange?.(false)}
          >
            {localization.DONE}
          </Button>
        </>
      }
      {...props}
    >
      <div className="break-all rounded-md bg-muted p-4 font-mono text-sm">{apiKey}</div>
    </DialogComponent>
  );
}
