import type { ReactNode } from 'react';

import type { AuthLocalization } from '@/lib/localization';
import type { AuthViewPath, AuthViewPaths } from '@/lib/view-paths';
import type { PasswordValidation } from '@/types/generals';

export type AuthViewClassNames = {
  base?: string;
  content?: string;
  description?: string;
  footer?: string;
  footerLink?: string;
  continueWith?: string;
  form?: AuthFormClassNames;
  header?: string;
  separator?: string;
  title?: string;
};

export interface AuthViewProps {
  className?: string;
  classNames?: AuthViewClassNames;
  callbackURL?: string;
  cardHeader?: ReactNode;
  localization?: AuthLocalization;
  path?: string;
  pathname?: string;
  redirectTo?: string;
  socialLayout?: 'auto' | 'horizontal' | 'grid' | 'vertical';
  view?: keyof AuthViewPaths;
  otpSeparators?: 0 | 1 | 2;
}

export type AuthFormClassNames = {
  base?: string;
  button?: string;
  checkbox?: string;
  description?: string;
  error?: string;
  forgotPasswordLink?: string;
  icon?: string;
  input?: string;
  label?: string;
  otpInput?: string;
  otpInputContainer?: string;
  outlineButton?: string;
  primaryButton?: string;
  providerButton?: string;
  qrCode?: string;
  secondaryButton?: string;
};

export interface AuthFormProps {
  className?: string;
  classNames?: AuthFormClassNames;
  callbackURL?: string;
  isSubmitting?: boolean;
  localization?: AuthLocalization;
  pathname?: string;
  redirectTo?: string;
  view?: AuthViewPath;
  otpSeparators?: 0 | 1 | 2;
  setIsSubmitting?: (isSubmitting: boolean) => void;
  passwordValidation?: PasswordValidation;
}

export interface AuthButtonProps {
  classNames?: AuthViewClassNames;
  isSubmitting?: boolean;
  localization?: AuthLocalization;
  view?: AuthViewPath;
  redirectTo?: string;
  setIsSubmitting?: (isSubmitting: boolean) => void;
}
