import type { Locale, Messages } from '@repo/i18n/types';

export interface BaseMailProps {
  locale: Locale;
  translations: Messages;
}

export interface DefaultMailProps extends BaseMailProps {
  name?: string;
  url?: string;
  expiresIn?: string;
}

export interface ChangeEmailMailProps extends DefaultMailProps {
  email: string;
  newEmail: string;
}

export interface OtpMailProps extends BaseMailProps {
  name?: string;
  code: string;
  expiresIn?: string;
}

export interface WorkspaceInvitationMailProps extends DefaultMailProps {
  workspaceName: string;
  inviterName?: string;
}
