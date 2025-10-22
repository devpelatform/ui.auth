'use client';

import { type ComponentProps, useState } from 'react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

import { Button, Input } from '@pelatform/ui/default';
import { cn } from '@/lib/utils';

export function PasswordInput({
  className,
  variant,
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
        variant={variant}
        className={cn(enableToggle && 'pe-10', className)}
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
            className="absolute end-0 top-0 bg-transparent!"
            onClick={() => setIsVisible(!isVisible)}
            disabled={disabled}
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
