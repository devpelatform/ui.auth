'use client';

import { type ComponentProps, useState } from 'react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

import { Button, Input } from '@pelatform/ui/default';
import { cn } from '@/lib/utils';

export function PasswordInput({
  className,
  enableToggle,
  onChange,
  ...props
}: ComponentProps<typeof Input> & { enableToggle?: boolean }) {
  const [disabled, setDisabled] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative">
      <Input
        type={isVisible && enableToggle ? 'text' : 'password'}
        className={cn(enableToggle && 'pr-10', className)}
        {...props}
        onChange={(event) => {
          setDisabled(!event.target.value);
          onChange?.(event);
        }}
      />

      {enableToggle && (
        <>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="!bg-transparent absolute top-0 right-0"
            disabled={disabled}
            onClick={() => setIsVisible(!isVisible)}
          >
            {isVisible ? <EyeIcon /> : <EyeOffIcon />}
          </Button>
          <style>{`
            .hide-password-toggle::-ms-reveal,
            .hide-password-toggle::-ms-clear {
              visibility: hidden;
              pointer-events: none;
              display: none;
            }
          `}</style>
        </>
      )}
    </div>
  );
}
