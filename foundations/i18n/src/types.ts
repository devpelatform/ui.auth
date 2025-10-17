import type { config } from '@repo/config';

type AdminMessages = typeof import('../messages/en/admin.json');
type AuthMessages = typeof import('../messages/en/auth.json');
type CommonMessages = typeof import('../messages/en/common.json');
type DashboardMessages = typeof import('../messages/en/dashboard.json');
type EmailMessages = typeof import('../messages/en/email.json');
type FormsMessages = typeof import('../messages/en/forms.json');
type MarketingMessages = typeof import('../messages/en/marketing.json');
type PagesMessages = typeof import('../messages/en/pages.json');
type ProjectMessages = typeof import('../messages/en/project.json');

export const TRANSLATION_ENTITIES = [
  'admin',
  'auth',
  'common',
  'dashboard',
  'email',
  'forms',
  'marketing',
  'pages',
  'project',
] as const;

export type TranslationEntity = (typeof TRANSLATION_ENTITIES)[number];

export type EntityName = TranslationEntity;

export type Messages = {
  admin: AdminMessages;
  auth: AuthMessages;
  common: CommonMessages;
  dashboard: DashboardMessages;
  email: EmailMessages;
  forms: FormsMessages;
  marketing: MarketingMessages;
  pages: PagesMessages;
  project: ProjectMessages;
};

export type Locale = keyof (typeof config)['i18n']['locales'];
