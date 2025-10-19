'use client';

import type { ComponentProps, ReactNode } from 'react';

import {
  Button,
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Skeleton,
  Spinner,
} from '@pelatform/ui/default';
import { useFormState } from '@pelatform/ui/re/react-hook-form';
import type { AuthLocalization } from '@/lib/localization';
import { cn } from '@/lib/utils';
import type { ButtonVariant } from '@/types/components';
import type { UserAvatarClassNames } from './user-avatar';

export type SettingsCardClassNames = {
  base?: string;
  avatar?: UserAvatarClassNames;
  button?: string;
  cell?: string;
  checkbox?: string;
  destructiveButton?: string;
  content?: string;
  description?: string;
  dialog?: {
    content?: string;
    footer?: string;
    header?: string;
  };
  error?: string;
  footer?: string;
  header?: string;
  icon?: string;
  input?: string;
  instructions?: string;
  label?: string;
  primaryButton?: string;
  secondaryButton?: string;
  outlineButton?: string;
  skeleton?: string;
  title?: string;
};

export interface SettingsCardProps extends Omit<ComponentProps<typeof Card>, 'title' | 'variant'> {
  children?: ReactNode;
  className?: string;
  classNames?: SettingsCardClassNames;
  title?: ReactNode;
  description?: ReactNode;
  instructions?: ReactNode;
  actionLabel?: ReactNode;
  isSubmitting?: boolean;
  disabled?: boolean;
  isPending?: boolean;
  optimistic?: boolean;
  variant?: ButtonVariant;
  localization?: AuthLocalization;
  action?: () => Promise<unknown> | unknown;
}

export function SettingsCard({
  children,
  className,
  classNames,
  title,
  description,
  instructions,
  actionLabel,
  disabled,
  isPending,
  isSubmitting,
  optimistic,
  variant,
  action,
  ...props
}: SettingsCardProps) {
  return (
    <Card
      className={cn(
        'w-full pb-0 text-start',
        variant === 'destructive' && 'border-destructive/40',
        className,
        classNames?.base,
      )}
      {...props}
    >
      <SettingsCardHeader
        classNames={classNames}
        description={description}
        isPending={isPending}
        title={title}
      />

      {children}

      <SettingsCardFooter
        classNames={classNames}
        actionLabel={actionLabel}
        disabled={disabled}
        isPending={isPending}
        isSubmitting={isSubmitting}
        instructions={instructions}
        optimistic={optimistic}
        variant={variant}
        action={action}
      />
    </Card>
  );
}

export interface SettingsCardHeaderProps {
  className?: string;
  classNames?: SettingsCardClassNames;
  description?: ReactNode;
  isPending?: boolean;
  title: ReactNode;
}

export function SettingsCardHeader({
  className,
  classNames,
  description,
  isPending,
  title,
}: SettingsCardHeaderProps) {
  return (
    <CardHeader
      className={cn(
        'flex-col items-start justify-start gap-1.5 p-5',
        classNames?.header,
        className,
      )}
    >
      {isPending ? (
        <>
          <Skeleton className={cn('my-0.5 h-5 w-1/3 md:h-5.5', classNames?.skeleton)} />

          {description && (
            <Skeleton className={cn('mt-1.5 mb-0.5 h-3 w-2/3 md:h-3.5', classNames?.skeleton)} />
          )}
        </>
      ) : (
        <>
          <CardTitle className={cn('text-lg md:text-xl', classNames?.title)}>{title}</CardTitle>

          {description && (
            <CardDescription className={cn('text-xs md:text-sm', classNames?.description)}>
              {description}
            </CardDescription>
          )}
        </>
      )}
    </CardHeader>
  );
}

export interface SettingsCardFooterProps {
  className?: string;
  classNames?: SettingsCardClassNames;
  actionLabel?: ReactNode;
  disabled?: boolean;
  instructions?: ReactNode;
  isPending?: boolean;
  isSubmitting?: boolean;
  optimistic?: boolean;
  variant?: ButtonVariant;
  action?: () => Promise<unknown> | unknown;
}

export function SettingsCardFooter({
  className,
  classNames,
  actionLabel,
  disabled,
  instructions,
  isPending,
  isSubmitting,
  variant,
  action,
}: SettingsCardFooterProps) {
  return (
    <CardFooter
      className={cn(
        'flex flex-col justify-between gap-4 rounded-b-xl md:flex-row',
        (actionLabel || instructions) && '!py-4 border-t',
        variant === 'destructive' ? 'border-destructive/30 bg-destructive/15' : 'bg-sidebar',
        className,
        classNames?.footer,
      )}
    >
      {isPending ? (
        <>
          {instructions && (
            <Skeleton
              className={cn('my-0.5 h-3 w-48 max-w-full md:h-4 md:w-56', classNames?.skeleton)}
            />
          )}

          {actionLabel && <Skeleton className={cn('h-8 w-14 md:ms-auto', classNames?.skeleton)} />}
        </>
      ) : (
        <>
          {instructions && (
            <CardDescription
              className={cn(
                'text-center text-muted-foreground text-xs md:text-start md:text-sm',
                classNames?.instructions,
              )}
            >
              {instructions}
            </CardDescription>
          )}

          {actionLabel && (
            <SettingsActionButton
              classNames={classNames}
              actionLabel={actionLabel}
              disabled={disabled}
              isSubmitting={isSubmitting}
              variant={variant}
              onClick={action}
            />
          )}
        </>
      )}
    </CardFooter>
  );
}

export interface SettingsActionButtonProps extends ComponentProps<typeof Button> {
  classNames?: SettingsCardClassNames;
  actionLabel: ReactNode;
  disabled?: boolean;
  isSubmitting?: boolean;
}

export function SettingsActionButton({
  classNames,
  actionLabel,
  disabled,
  isSubmitting,
  variant,
  onClick,
  ...props
}: SettingsActionButtonProps) {
  if (!onClick) {
    const formState = useFormState();
    isSubmitting = formState.isSubmitting;
  }

  return (
    <Button
      type={onClick ? 'button' : 'submit'}
      variant={variant}
      size="sm"
      className={cn(
        'md:ms-auto',
        classNames?.button,
        !variant && classNames?.primaryButton,
        variant === 'destructive' && classNames?.destructiveButton,
      )}
      disabled={isSubmitting || disabled}
      onClick={onClick}
      {...props}
    >
      {isSubmitting && <Spinner />}
      {actionLabel}
    </Button>
  );
}
