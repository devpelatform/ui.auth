import { ChangeEmail } from './ChangeEmail';
import { ConfirmSignup } from './ConfirmSignup';
import { EmailOtp } from './EmailOtp';
import { EmailVerification } from './EmailVerification';
import { ForgotPassword } from './ForgotPassword';
import { MagicLink } from './MagicLink';
import { NewsletterSignup } from './NewsletterSignup';
import { Welcome } from './Welcome';
import { WorkspaceInvitation } from './WorkspaceInvitation';

export const mailTemplates = {
  changeEmail: ChangeEmail,
  confirmSignup: ConfirmSignup,
  emailOtp: EmailOtp,
  emailVerification: EmailVerification,
  forgotPassword: ForgotPassword,
  magicLink: MagicLink,
  newsletterSignup: NewsletterSignup,
  welcome: Welcome,
  workspaceInvitation: WorkspaceInvitation,
} as const;
