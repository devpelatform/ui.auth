import { config } from '@repo/config';
// arab
import admin_ar from '../messages/ar/admin.json';
import auth_ar from '../messages/ar/auth.json';
import common_ar from '../messages/ar/common.json';
import dashboard_ar from '../messages/ar/dashboard.json';
import email_ar from '../messages/ar/email.json';
import forms_ar from '../messages/ar/forms.json';
import marketing_ar from '../messages/ar/marketing.json';
import pages_ar from '../messages/ar/pages.json';
import project_ar from '../messages/ar/project.json';
// english
import admin_en from '../messages/en/admin.json';
import auth_en from '../messages/en/auth.json';
import common_en from '../messages/en/common.json';
import dashboard_en from '../messages/en/dashboard.json';
import email_en from '../messages/en/email.json';
import forms_en from '../messages/en/forms.json';
import marketing_en from '../messages/en/marketing.json';
import pages_en from '../messages/en/pages.json';
import project_en from '../messages/en/project.json';
// indonesia
import admin_id from '../messages/id/admin.json';
import auth_id from '../messages/id/auth.json';
import common_id from '../messages/id/common.json';
import dashboard_id from '../messages/id/dashboard.json';
import email_id from '../messages/id/email.json';
import forms_id from '../messages/id/forms.json';
import marketing_id from '../messages/id/marketing.json';
import pages_id from '../messages/id/pages.json';
import project_id from '../messages/id/project.json';
import type { EntityName, Locale } from './types';

export const getTranslationMap = (
  locale: Locale | string = config.i18n.defaultLocale,
): Record<EntityName, Record<string, unknown>> => {
  if (locale === 'ar') {
    return {
      admin: admin_ar,
      auth: auth_ar,
      common: common_ar,
      dashboard: dashboard_ar,
      email: email_ar,
      forms: forms_ar,
      marketing: marketing_ar,
      pages: pages_ar,
      project: project_ar,
    };
  }

  if (locale === 'id') {
    return {
      admin: admin_id,
      auth: auth_id,
      common: common_id,
      dashboard: dashboard_id,
      email: email_id,
      forms: forms_id,
      marketing: marketing_id,
      pages: pages_id,
      project: project_id,
    };
  }

  return {
    admin: admin_en,
    auth: auth_en,
    common: common_en,
    dashboard: dashboard_en,
    email: email_en,
    forms: forms_en,
    marketing: marketing_en,
    pages: pages_en,
    project: project_en,
  };
};

export const defaultTranslations = (
  locale: Locale = config.i18n.defaultLocale,
): Record<EntityName, Record<string, unknown>> => {
  const map = getTranslationMap(locale);
  return map;
};
