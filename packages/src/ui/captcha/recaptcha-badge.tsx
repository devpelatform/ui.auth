import { useAuth } from '../../hooks/main';
import { useIsHydrated } from '../../hooks/private';
import type { AuthLocalization } from '../../lib/localization/index';
import { cn } from '../../lib/utils';

interface RecaptchaBadgeProps {
  className?: string;
  localization: AuthLocalization;
}

export function RecaptchaBadge({ className, localization }: RecaptchaBadgeProps) {
  const { captcha } = useAuth();

  const isHydrated = useIsHydrated();

  if (!captcha) return null;

  if (!captcha.hideBadge) {
    return isHydrated ? (
      <style>{`.grecaptcha-badge { visibility: visible !important; }`}</style>
    ) : null;
  }

  return (
    <>
      <style>{`.grecaptcha-badge { visibility: hidden; }`}</style>
      <p className={cn('text-muted-foreground text-xs', className)}>
        {localization.PROTECTED_BY_RECAPTCHA} {localization.BY_CONTINUING_YOU_AGREE} Google{' '}
        <a
          href="https://policies.google.com/privacy"
          target="_blank"
          rel="noreferrer"
          className="text-foreground hover:underline"
        >
          {localization.PRIVACY_POLICY}
        </a>{' '}
        &{' '}
        <a
          href="https://policies.google.com/terms"
          target="_blank"
          rel="noreferrer"
          className="text-foreground hover:underline"
        >
          {localization.TERMS_OF_SERVICE}
        </a>
        .
      </p>
    </>
  );
}
