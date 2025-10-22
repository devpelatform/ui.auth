import type { ComponentProps, ReactNode } from 'react';

import type { Avatar, Card, Dialog } from '@pelatform/ui/default';
import type { AuthLocalization } from '@/lib/localization';
import type { Organization } from './auth';
import type { ButtonSize } from './components';
import type { Profile } from './generals';

export type AvatarClassNames = {
  base?: string;
  fallback?: string;
  fallbackIcon?: string;
  image?: string;
  skeleton?: string;
};

export type ViewClassNames = {
  base?: string;
  content?: string;
  title?: string;
  subtitle?: string;
  skeleton?: string;
  icon?: string;
  avatar?: AvatarClassNames;
};

export type DialogClassNames = {
  content?: string;
  header?: string;
  footer?: string;
};

export type CardClassNames = {
  base?: string;
  cell?: string;
  content?: string;
  header?: string;
  footer?: string;
  grid?: string;
  skeleton?: string;
  title?: string;
  description?: string;
  instructions?: string;
  error?: string;
  label?: string;
  input?: string;
  checkbox?: string;
  icon?: string;
  button?: string;
  primaryButton?: string;
  secondaryButton?: string;
  outlineButton?: string;
  destructiveButton?: string;
  avatar?: AvatarClassNames;
  dialog?: DialogClassNames;
};

export interface BaseProps {
  className?: string;
  localization?: AuthLocalization;
}

export interface AvatarProps extends BaseProps, ComponentProps<typeof Avatar> {
  classNames?: AvatarClassNames;
  isPending?: boolean;
  organization?: Partial<Organization> | null;
  size?: ButtonSize | null;
  user?: Profile | null;
}

export interface ViewProps extends BaseProps {
  classNames?: ViewClassNames;
  isPending?: boolean;
  organization?: Organization | null;
  size?: ButtonSize | null;
  user?: Profile | null;
}

export interface DialogComponentProps extends BaseProps, ComponentProps<typeof Dialog> {
  children?: ReactNode;
  classNames?: CardClassNames;
  title?: string;
  description?: string;
  disableFooter?: boolean;
  cancelButton?: boolean;
  cancelButtonDisabled?: boolean;
  button?: ReactNode;
}

export interface CardComponentProps
  extends BaseProps,
    Omit<ComponentProps<typeof Card>, 'title' | 'variant'> {
  children?: ReactNode;
  classNames?: CardClassNames;
  title?: ReactNode;
  description?: ReactNode;
  instructions?: ReactNode;
  actionLabel?: ReactNode;
  action?: () => Promise<unknown> | unknown;
  disabled?: boolean;
  isDestructive?: boolean;
  isPending?: boolean;
  isSubmitting?: boolean;
}
