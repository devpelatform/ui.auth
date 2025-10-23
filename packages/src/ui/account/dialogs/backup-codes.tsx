'use client';

import { CheckIcon, CopyIcon } from 'lucide-react';

import { Button } from '@pelatform/ui/default';
import { useCopyToClipboard } from '@pelatform/ui/hooks';
import { useLocalization } from '@/hooks/private';
import { cn } from '@/lib/utils';
import type { DialogComponentProps } from '@/types/ui';
import { DialogComponent } from '../../shared/components/dialog';

export function BackupCodesDialog({
  classNames,
  localization: localizationProp,
  onOpenChange,
  title,
  description,
  backupCodes,
  ...props
}: DialogComponentProps & { backupCodes: string[] }) {
  const localization = useLocalization(localizationProp);

  const { copy, copied } = useCopyToClipboard();

  return (
    <DialogComponent
      classNames={classNames}
      localization={localization}
      onOpenChange={onOpenChange}
      title={title || localization.BACKUP_CODES}
      description={description || localization.BACKUP_CODES_DESCRIPTION}
      button={
        <>
          <Button
            type="button"
            variant="outline"
            className={cn(classNames?.button, classNames?.outlineButton)}
            onClick={() => copy(backupCodes.join('\n'))}
            disabled={copied}
          >
            {copied ? (
              <>
                <CheckIcon className={classNames?.icon} />
                {localization.COPIED_TO_CLIPBOARD}
              </>
            ) : (
              <>
                <CopyIcon className={classNames?.icon} />
                {localization.COPY_ALL_CODES}
              </>
            )}
          </Button>
          <Button
            type="button"
            className={cn(classNames?.button, classNames?.primaryButton)}
            onClick={() => onOpenChange?.(false)}
          >
            {localization.CONTINUE}
          </Button>
        </>
      }
      {...props}
    >
      <div className="grid grid-cols-2 gap-2">
        {backupCodes.map((code, index) => (
          <div key={index} className="rounded-md bg-muted p-2 text-center font-mono text-sm">
            {code}
          </div>
        ))}
      </div>
    </DialogComponent>
  );
}
