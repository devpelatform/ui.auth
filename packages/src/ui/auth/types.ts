import type { ReactNode } from 'react';

import type { AuthViewPath, AuthViewPaths } from '../../lib/view-paths';
import type { PasswordValidation } from '../../types/generals';
import type { BaseProps } from '../../types/ui';

export type AuthViewClassNames = {
  base?: string;
  header?: string;
  title?: string;
  description?: string;
  content?: string;
  continueWith?: string;
  separator?: string;
  footer?: string;
  footerLink?: string;
  form?: AuthFormClassNames;
};

export type AuthFormClassNames = {
  base?: string;
  button?: string;
  icon?: string;
  label?: string;
  input?: string;
  error?: string;
  checkbox?: string;
  description?: string;
  forgotPasswordLink?: string;
  otpInput?: string;
  otpInputContainer?: string;
  qrCode?: string;
  primaryButton?: string;
  secondaryButton?: string;
  outlineButton?: string;
  providerButton?: string;
  lastLoginMethod?: string;
};

export interface AuthViewProps extends BaseProps {
  classNames?: AuthViewClassNames;
  callbackURL?: string;
  cardHeader?: ReactNode;
  otpSeparators?: 0 | 1 | 2;
  path?: string;
  pathname?: string;
  redirectTo?: string;
  socialLayout?: 'auto' | 'horizontal' | 'grid' | 'vertical';
  view?: keyof AuthViewPaths;
}

export interface AuthFormProps extends BaseProps {
  classNames?: AuthFormClassNames;
  callbackURL?: string;
  isSubmitting?: boolean;
  otpSeparators?: 0 | 1 | 2;
  passwordValidation?: PasswordValidation;
  pathname?: string;
  redirectTo?: string;
  setIsSubmitting?: (isSubmitting: boolean) => void;
  view?: AuthViewPath;
}

export interface AuthButtonProps extends BaseProps {
  classNames?: AuthViewClassNames;
  isSubmitting?: boolean;
  redirectTo?: string;
  setIsSubmitting?: (isSubmitting: boolean) => void;
  view?: AuthViewPath;
}
