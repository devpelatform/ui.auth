'use client';

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@pelatform/ui/default';
import { useLocalization } from '../../../hooks/private';
import { cn } from '../../../lib/utils';
import type { DialogComponentProps } from '../../../types/ui';

export function DialogComponent({
  children,
  classNames,
  localization: localizationProp,
  onOpenChange,
  title,
  description,
  disableFooter,
  cancelButton,
  cancelButtonDisabled,
  button,
  ...props
}: DialogComponentProps) {
  const localization = useLocalization(localizationProp);

  return (
    <Dialog onOpenChange={onOpenChange} {...props}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className={classNames?.dialog?.content}
      >
        <DialogHeader className={cn('space-y-2', classNames?.header)}>
          <DialogTitle className={classNames?.title}>{title}</DialogTitle>
          {description && (
            <DialogDescription className={classNames?.description}>{description}</DialogDescription>
          )}
        </DialogHeader>

        {children}

        {!disableFooter && (
          <DialogFooterComponent
            classNames={classNames}
            localization={localization}
            onOpenChange={onOpenChange}
            cancelButton={cancelButton}
            cancelButtonDisabled={cancelButtonDisabled}
            button={button}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

export function DialogFooterComponent({
  classNames,
  localization: localizationProp,
  onOpenChange,
  cancelButton,
  cancelButtonDisabled,
  button,
}: DialogComponentProps) {
  const localization = useLocalization(localizationProp);

  return (
    <DialogFooter className={classNames?.dialog?.footer}>
      {cancelButton && (
        <Button
          type="button"
          variant="secondary"
          className={cn(classNames?.button, classNames?.secondaryButton)}
          onClick={() => onOpenChange?.(false)}
          disabled={cancelButtonDisabled}
        >
          {localization.CANCEL}
        </Button>
      )}
      {button}
    </DialogFooter>
  );
}
