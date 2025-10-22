'use client';

import type { ComponentProps } from 'react';

import { Button, Card, CardContent, CardFooter, Skeleton, Spinner } from '@pelatform/ui/default';
import { useFormState } from '@pelatform/ui/re/react-hook-form';
import { cn } from '@/lib/utils';
import type { CardComponentProps } from '@/types/ui';

export function CardComponent({
  children,
  className,
  classNames,
  title,
  description,
  instructions,
  actionLabel,
  action,
  disabled,
  isDestructive,
  isPending,
  isSubmitting,
  ...props
}: CardComponentProps) {
  return (
    <Card
      className={cn(
        'w-full overflow-hidden',
        isDestructive && 'border-destructive/70',
        className,
        classNames?.base,
      )}
      {...props}
    >
      <CardContent className={cn('space-y-6 p-5 sm:p-10', classNames?.content)}>
        <CardHeaderComponent
          classNames={classNames}
          description={description}
          title={title}
          isPending={isPending}
        />

        {children}
      </CardContent>

      <CardFooterComponent
        classNames={classNames}
        instructions={instructions}
        actionLabel={actionLabel}
        action={action}
        disabled={disabled}
        isDestructive={isDestructive}
        isPending={isPending}
        isSubmitting={isSubmitting}
      />
    </Card>
  );
}

export function CardHeaderComponent({
  className,
  classNames,
  title,
  description,
  isPending,
}: CardComponentProps) {
  return (
    <div className={cn('flex flex-col space-y-2', className, classNames?.header)}>
      {isPending ? (
        <>
          <Skeleton className={cn('my-0.5 h-5 w-1/3 md:h-5.5', classNames?.skeleton)} />
          {description && (
            <Skeleton className={cn('mt-1.5 mb-0.5 h-3 w-2/3 md:h-3.5', classNames?.skeleton)} />
          )}
        </>
      ) : (
        <>
          <h2 className={cn('font-medium text-xl', classNames?.title)}>{title}</h2>
          {description && (
            <p className={cn('text-muted-foreground text-sm', classNames?.description)}>
              {description}
            </p>
          )}
        </>
      )}
    </div>
  );
}

export function CardFooterComponent({
  className,
  classNames,
  instructions,
  actionLabel,
  action,
  disabled,
  isDestructive,
  isPending,
  isSubmitting,
}: CardComponentProps) {
  return (
    <CardFooter
      className={cn(
        'flex items-center justify-between space-x-4 bg-muted p-3 sm:px-10',
        // (actionLabel || instructions) && 'border-t py-4!',
        isDestructive && 'border-destructive/70',
        className,
        classNames?.footer,
      )}
    >
      {isPending ? (
        <>
          {instructions && (
            <Skeleton
              className={cn(
                'my-0.5 h-3 w-48 max-w-full bg-muted-foreground/20 md:h-4 md:w-60',
                classNames?.skeleton,
              )}
            />
          )}
          {actionLabel && (
            <Skeleton
              className={cn('h-8 w-20 bg-muted-foreground/20 md:ms-auto', classNames?.skeleton)}
            />
          )}
        </>
      ) : (
        <>
          {instructions && (
            <div
              className={cn('text-muted-foreground text-xs md:text-sm', classNames?.instructions)}
            >
              {instructions}
            </div>
          )}
          {actionLabel && (
            <CardActionComponent
              classNames={classNames}
              actionLabel={actionLabel}
              onClick={action}
              disabled={disabled}
              isDestructive={isDestructive}
              isSubmitting={isSubmitting}
            />
          )}
        </>
      )}
    </CardFooter>
  );
}

export function CardActionComponent({
  classNames,
  actionLabel,
  onClick,
  disabled,
  isDestructive,
  isSubmitting,
  ...props
}: CardComponentProps & ComponentProps<typeof Button>) {
  if (!onClick) {
    const formState = useFormState();
    isSubmitting = formState.isSubmitting;
  }

  return (
    <Button
      type={onClick ? 'button' : 'submit'}
      variant={isDestructive ? 'destructive' : 'primary'}
      size="sm"
      className={cn(
        'ms-auto',
        isSubmitting || disabled ? 'pointer-events-auto! cursor-not-allowed' : '',
        classNames?.button,
        isDestructive ? classNames?.destructiveButton : classNames?.primaryButton,
      )}
      onClick={onClick}
      disabled={isSubmitting || disabled}
      {...props}
    >
      {isSubmitting && <Spinner />}
      {actionLabel}
    </Button>
  );
}
