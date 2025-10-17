import { createNodemailer, createResend } from '@pelatform/email';
import { config } from '@repo/config';
import type { Locale } from '@repo/i18n/types';
import type { mailTemplates } from '../emails';
import type { TemplateId } from './templates';
import { getTemplate } from './templates';

export async function sendEmail<T extends TemplateId>(
  params: {
    to: string;
    locale?: Locale;
  } & (
    | {
        templateId: T;
        context: Omit<Parameters<(typeof mailTemplates)[T]>[0], 'locale' | 'translations'>;
      }
    | {
        subject: string;
        text?: string;
        html?: string;
      }
  ),
) {
  const { to, locale = config.i18n.defaultLocale } = params;

  let html: string;
  let text: string;
  let subject: string;

  if ('templateId' in params) {
    const { templateId, context } = params;
    const template = await getTemplate({
      templateId,
      context,
      locale,
    });
    subject = template.subject;
    text = template.text;
    html = template.html;
  } else {
    subject = params.subject;
    text = params.text ?? '';
    html = params.html ?? '';
  }

  let email = null;

  if (config.email.provider === 'resend') {
    email = createResend({
      apiKey: process.env.PELATFORM_EMAIL_RESEND_API_KEY as string,
      from: {
        name: process.env.PELATFORM_EMAIL_FROM_NAME as string,
        email: process.env.PELATFORM_EMAIL_FROM_EMAIL as string,
      },
      replyTo: process.env.PELATFORM_EMAIL_REPLY_TO as string,
    });
  } else {
    email = createNodemailer({
      smtp: {
        host: process.env.PELATFORM_EMAIL_SMTP_HOST as string,
        port: Number(process.env.PELATFORM_EMAIL_SMTP_PORT || 587),
        secure: Boolean(process.env.PELATFORM_EMAIL_SMTP_SECURE || false),
        auth: {
          user: process.env.PELATFORM_EMAIL_SMTP_USER as string,
          pass: process.env.PELATFORM_EMAIL_SMTP_PASS as string,
        },
      },
      from: {
        name: process.env.PELATFORM_EMAIL_FROM_NAME as string,
        email: process.env.PELATFORM_EMAIL_FROM_EMAIL as string,
      },
      replyTo: process.env.PELATFORM_EMAIL_REPLY_TO as string,
    });
  }

  try {
    const result = await email.sendEmail({
      to,
      subject,
      text,
      html,
    });

    if (result.success) {
      return {
        success: true,
        messageId: result.messageId,
      };
    } else {
      return {
        success: false,
        error: result.error,
      };
    }
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
}
