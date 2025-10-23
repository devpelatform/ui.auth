'use client';

import { Card, Skeleton } from '@pelatform/ui/default';
import { cn } from '../../../lib/utils';
import type { CardClassNames } from '../../../types/ui';

export function SkeletonViewComponent({ classNames }: { classNames?: CardClassNames }) {
  return (
    <Card className={cn('flex-row items-center gap-3 px-4 py-3', classNames?.cell)}>
      <div className="flex items-center gap-2">
        <Skeleton className={cn('size-5 rounded-full', classNames?.skeleton)} />
        <div>
          <Skeleton className={cn('h-4 w-32', classNames?.skeleton)} />
        </div>
      </div>
      <Skeleton className={cn('ms-auto size-8 w-16', classNames?.skeleton)} />
    </Card>
  );
}

export function SkeletonInputComponent({ classNames }: { classNames?: CardClassNames }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Skeleton className={cn('h-4 w-32', classNames?.skeleton)} />
      <Skeleton className={cn('h-9 w-full', classNames?.skeleton)} />
    </div>
  );
}
