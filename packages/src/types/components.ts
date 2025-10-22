/* @private */

import type { ComponentType, ReactNode } from 'react';

import type { AlertToastOptions } from '@pelatform/ui/components';
import type { buttonVariants } from '@pelatform/ui/default';

export type Link = ComponentType<{
  href: string;
  className?: string;
  children: ReactNode;
}>;

export type ProviderIcon = ComponentType<{
  className?: string;
}>;

export type Provider = {
  provider: string;
  name: string;
  icon?: ProviderIcon;
};

export type RenderToast = ({
  message,
  icon,
  // variant,
}: {
  message?: string;
  icon?: AlertToastOptions['icon'];
  // variant?: AlertToastOptions['variant'];
}) => void;

export type ButtonVariant = NonNullable<Parameters<typeof buttonVariants>[0]>['variant'] | null;

export type ButtonSize =
  | NonNullable<Parameters<typeof buttonVariants>[0]>['size']
  | null
  | undefined;

export type FieldType = 'string' | 'number' | 'boolean';

export interface AdditionalField {
  type: FieldType;
  label: ReactNode;
  description?: ReactNode;
  instructions?: ReactNode;
  placeholder?: string;
  required?: boolean;
  multiline?: boolean; // Render a multi-line textarea for string fields
  validate?: (value: string) => Promise<boolean>;
}

export interface AdditionalFields {
  [key: string]: AdditionalField;
}
