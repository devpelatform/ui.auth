'use client';

import { useRef } from 'react';
import { CheckIcon, CopyIcon } from 'lucide-react';

import {
  Button,
  Input,
  Skeleton,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@pelatform/ui/default';
import { useCopyToClipboard } from '@pelatform/ui/hooks';
import { useLocalization } from '../../hooks/private';
import { cn } from '../../lib/utils';
import type { CardComponentProps } from '../../types/ui';
import { CardComponent } from './components/card';

export function DisplayIdCard({
  className,
  classNames,
  isPending,
  localization: localizationProp,
  id,
  title,
  description,
  ...props
}: CardComponentProps & {
  id: string | undefined;
  title: string;
  description: string;
}) {
  const localization = useLocalization(localizationProp);

  const { copy, copied } = useCopyToClipboard();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCopy = () => {
    if (inputRef.current) {
      copy(inputRef.current.value);
    }
  };

  return (
    <CardComponent
      className={className}
      classNames={classNames}
      title={title}
      description={description}
      isPending={isPending}
      {...props}
    >
      {isPending ? (
        <Skeleton className={cn('h-11.5 w-full max-w-md', classNames?.skeleton)} />
      ) : (
        <div
          className={cn(
            'flex w-full max-w-md items-center justify-between rounded-md border p-2',
            classNames?.grid,
          )}
        >
          <Input value={id} ref={inputRef} disabled className="border-none! bg-transparent!" />
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="dim" onClick={handleCopy} disabled={copied}>
                  {copied ? (
                    <CheckIcon className={cn('stroke-green-600', classNames?.icon)} />
                  ) : (
                    <CopyIcon className={classNames?.icon} />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent className="px-2 py-1 text-xs">
                {localization.COPY_TO_CLIPBOARD}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
    </CardComponent>
  );
}
