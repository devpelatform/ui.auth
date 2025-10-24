'use client';

import { useEffect, useState } from 'react';
import { ArrowLeftIcon } from 'lucide-react';

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardHeading,
  CardTitle,
  Separator,
} from '@pelatform/ui/default';
import { useAuth } from '../../hooks/main';
import { useIsHydrated, useLocalization } from '../../hooks/private';
import { socialProviders } from '../../lib/social-providers';
import { cn } from '../../lib/utils';
import type { AuthViewPath } from '../../lib/view-paths';
import { getViewByPath } from '../../lib/view-paths';
import { AcceptInvitation } from './accept-invitation';
import { AuthCallback } from './callback';
import { EmailOTPForm } from './email-otp';
import { ForgotPasswordForm } from './forgot-password';
import { MagicLinkForm } from './magic-link';
import { EmailOTPButton } from './partials/email-otp-button';
import { MagicLinkButton } from './partials/magic-link-button';
import { OneTap } from './partials/one-tap';
import { PasskeyButton } from './partials/passkey-button';
import { ProviderButton } from './partials/provider-button';
import { RecoverAccountForm } from './recover-account';
import { ResetPasswordForm } from './reset-password';
import { SignInForm } from './sign-in';
import { SignOut } from './sign-out';
import { SignUpForm } from './sign-up';
import { TwoFactorForm } from './two-factor';
import type { AuthFormProps, AuthViewProps } from './types';

export function AuthView({
  className,
  classNames,
  callbackURL,
  cardHeader,
  localization: localizationProp,
  otpSeparators = 1,
  path: pathProp,
  pathname,
  redirectTo,
  socialLayout: socialLayoutProp = 'auto',
  view: viewProp,
}: AuthViewProps) {
  const {
    basePath,
    credentials,
    emailOTP,
    genericOAuth,
    Link,
    magicLink,
    oneTap,
    organization,
    passkey,
    signUp,
    social,
    viewPaths,
  } = useAuth();

  const localization = useLocalization(localizationProp);
  const isHydrated = useIsHydrated();

  let socialLayout = socialLayoutProp;
  if (socialLayout === 'auto') {
    socialLayout = !credentials
      ? 'vertical'
      : social?.providers && social.providers.length > 2
        ? 'horizontal'
        : 'vertical';
  }

  const path = pathProp ?? pathname?.split('/').pop();

  const view = viewProp || getViewByPath(viewPaths!, path) || 'SIGN_IN';

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handlePageHide = () => setIsSubmitting(false);
    window.addEventListener('pagehide', handlePageHide);
    return () => {
      setIsSubmitting(false);
      window.removeEventListener('pagehide', handlePageHide);
    };
  }, []);

  if (view === 'CALLBACK') return <AuthCallback redirectTo={redirectTo} />;
  if (view === 'SIGN_OUT') return <SignOut />;
  if (organization && view === 'ACCEPT_INVITATION')
    return <AcceptInvitation localization={localization} />;

  const description =
    !credentials && !magicLink && !emailOTP
      ? localization.DISABLED_CREDENTIALS_DESCRIPTION
      : localization[`${view}_DESCRIPTION` as keyof typeof localization];

  return (
    <Card className={cn('w-full max-w-md', className, classNames?.base)}>
      <CardHeader className={cn('py-4', classNames?.header)}>
        {cardHeader ? (
          cardHeader
        ) : (
          <CardHeading>
            <CardTitle className={classNames?.title}>
              {localization[view as keyof typeof localization]}
            </CardTitle>
            {description && (
              <CardDescription className={classNames?.description}>{description}</CardDescription>
            )}
          </CardHeading>
        )}
      </CardHeader>

      <CardContent className={cn('grid gap-6', classNames?.content)}>
        {oneTap && ['SIGN_IN', 'SIGN_UP', 'MAGIC_LINK', 'EMAIL_OTP'].includes(view as string) && (
          <OneTap localization={localization} redirectTo={redirectTo} />
        )}
        {(credentials || magicLink || emailOTP) && (
          <div className="grid gap-4">
            <AuthForm
              classNames={classNames?.form}
              callbackURL={callbackURL}
              isSubmitting={isSubmitting}
              localization={localization}
              otpSeparators={otpSeparators}
              redirectTo={redirectTo}
              setIsSubmitting={setIsSubmitting}
              view={view}
            />
            {magicLink &&
              ((credentials &&
                ['FORGOT_PASSWORD', 'SIGN_UP', 'SIGN_IN', 'MAGIC_LINK', 'EMAIL_OTP'].includes(
                  view as string,
                )) ||
                (emailOTP && view === 'EMAIL_OTP')) && (
                <MagicLinkButton
                  classNames={classNames}
                  isSubmitting={isSubmitting}
                  localization={localization}
                  view={view}
                />
              )}
            {emailOTP &&
              ((credentials &&
                ['FORGOT_PASSWORD', 'SIGN_UP', 'SIGN_IN', 'MAGIC_LINK', 'EMAIL_OTP'].includes(
                  view as string,
                )) ||
                (magicLink && ['SIGN_IN', 'MAGIC_LINK'].includes(view as string))) && (
                <EmailOTPButton
                  classNames={classNames}
                  isSubmitting={isSubmitting}
                  localization={localization}
                  view={view}
                />
              )}
          </div>
        )}

        {view !== 'RESET_PASSWORD' &&
          (social?.providers?.length ||
            genericOAuth?.providers?.length ||
            (view === 'SIGN_IN' && passkey)) && (
            <>
              {(credentials || magicLink || emailOTP) && (
                <div className={cn('flex items-center gap-2', classNames?.continueWith)}>
                  <Separator className={cn('w-auto! grow', classNames?.separator)} />
                  <span className="shrink-0 text-muted-foreground text-sm">
                    {localization.OR_CONTINUE_WITH}
                  </span>
                  <Separator className={cn('w-auto! grow', classNames?.separator)} />
                </div>
              )}

              <div className="grid gap-4">
                {(social?.providers?.length || genericOAuth?.providers?.length) && (
                  <div
                    className={cn(
                      'flex w-full items-center justify-between gap-4',
                      socialLayout === 'horizontal' && 'flex-wrap',
                      socialLayout === 'vertical' && 'flex-col',
                      socialLayout === 'grid' && 'grid grid-cols-2',
                    )}
                  >
                    {social?.providers?.map((provider) => {
                      const socialProvider = socialProviders.find(
                        (socialProvider) => socialProvider.provider === provider,
                      );
                      if (!socialProvider) return null;
                      return (
                        <ProviderButton
                          key={provider}
                          classNames={classNames}
                          callbackURL={callbackURL}
                          isSubmitting={isSubmitting}
                          localization={localization}
                          provider={socialProvider}
                          redirectTo={redirectTo}
                          setIsSubmitting={setIsSubmitting}
                          socialLayout={socialLayout}
                        />
                      );
                    })}

                    {genericOAuth?.providers?.map((provider) => (
                      <ProviderButton
                        key={provider.provider}
                        classNames={classNames}
                        callbackURL={callbackURL}
                        isSubmitting={isSubmitting}
                        localization={localization}
                        provider={provider}
                        redirectTo={redirectTo}
                        setIsSubmitting={setIsSubmitting}
                        socialLayout={socialLayout}
                        other
                      />
                    ))}
                  </div>
                )}

                {passkey &&
                  [
                    'SIGN_IN',
                    'MAGIC_LINK',
                    'EMAIL_OTP',
                    'RECOVER_ACCOUNT',
                    'TWO_FACTOR',
                    'FORGOT_PASSWORD',
                  ].includes(view as string) && (
                    <PasskeyButton
                      classNames={classNames}
                      isSubmitting={isSubmitting}
                      localization={localization}
                      redirectTo={redirectTo}
                      setIsSubmitting={setIsSubmitting}
                    />
                  )}
              </div>
            </>
          )}
      </CardContent>

      {credentials && signUp && (
        <CardFooter
          className={cn('justify-center gap-1.5 text-muted-foreground text-sm', classNames?.footer)}
        >
          {view === 'SIGN_IN' || view === 'MAGIC_LINK' || view === 'EMAIL_OTP' ? (
            localization.DONT_HAVE_AN_ACCOUNT
          ) : view === 'SIGN_UP' ? (
            localization.ALREADY_HAVE_AN_ACCOUNT
          ) : (
            <ArrowLeftIcon className="size-3" />
          )}
          {view === 'SIGN_IN' ||
          view === 'MAGIC_LINK' ||
          view === 'EMAIL_OTP' ||
          view === 'SIGN_UP' ? (
            <Link
              href={`${basePath}/${viewPaths[view === 'SIGN_IN' || view === 'MAGIC_LINK' || view === 'EMAIL_OTP' ? 'SIGN_UP' : 'SIGN_IN']}${
                isHydrated ? window.location.search : ''
              }`}
            >
              <Button
                mode="link"
                underline="dashed"
                size="sm"
                className={cn('px-0 text-foreground', classNames?.footerLink)}
              >
                {view === 'SIGN_IN' || view === 'MAGIC_LINK' || view === 'EMAIL_OTP'
                  ? localization.SIGN_UP
                  : localization.SIGN_IN}
              </Button>
            </Link>
          ) : (
            <Button
              mode="link"
              underline="dashed"
              size="sm"
              className={cn('px-0 text-foreground', classNames?.footerLink)}
              onClick={() => window.history.back()}
            >
              {localization.GO_BACK}
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}

export function AuthForm({
  className,
  classNames,
  callbackURL,
  isSubmitting,
  localization: localizationProp,
  otpSeparators = 1,
  pathname,
  redirectTo,
  setIsSubmitting,
  view,
}: AuthFormProps) {
  const {
    basePath,
    credentials,
    emailOTP,
    magicLink,
    replace,
    signUp,
    twoFactor: twoFactorEnabled,
    viewPaths,
  } = useAuth();

  const localization = useLocalization(localizationProp);

  const signUpEnabled = !!signUp;

  useEffect(() => {
    if (pathname && !getViewByPath(viewPaths, pathname)) {
      console.error(`Invalid auth view: ${pathname}`);
      replace(`${basePath}/${viewPaths.SIGN_IN}${window.location.search}`);
    }
  }, [pathname, viewPaths, basePath, replace]);

  view = view || (getViewByPath(viewPaths, pathname) as AuthViewPath) || 'SIGN_IN';

  // Redirect to appropriate view based on enabled features
  useEffect(() => {
    let isInvalidView = false;

    if (view === 'MAGIC_LINK' && (!magicLink || (!credentials && !emailOTP))) {
      isInvalidView = true;
    }

    if (view === 'EMAIL_OTP' && (!emailOTP || (!credentials && !magicLink))) {
      isInvalidView = true;
    }

    if (view === 'SIGN_UP' && !signUpEnabled) {
      isInvalidView = true;
    }

    if (
      !credentials &&
      ['SIGN_UP', 'FORGOT_PASSWORD', 'RESET_PASSWORD', 'TWO_FACTOR', 'RECOVER_ACCOUNT'].includes(
        view,
      )
    ) {
      isInvalidView = true;
    }

    if (['TWO_FACTOR', 'RECOVER_ACCOUNT'].includes(view) && !twoFactorEnabled) {
      isInvalidView = true;
    }

    if (isInvalidView) {
      replace(`${basePath}/${viewPaths.SIGN_IN}${window.location.search}`);
    }
  }, [
    basePath,
    view,
    viewPaths,
    credentials,
    replace,
    emailOTP,
    signUpEnabled,
    magicLink,
    twoFactorEnabled,
  ]);

  if (view === 'SIGN_OUT') return <SignOut />;
  if (view === 'CALLBACK') return <AuthCallback redirectTo={redirectTo} />;

  if (view === 'SIGN_IN') {
    return credentials ? (
      <SignInForm
        className={className}
        classNames={classNames}
        isSubmitting={isSubmitting}
        localization={localization}
        redirectTo={redirectTo}
        setIsSubmitting={setIsSubmitting}
      />
    ) : magicLink ? (
      <MagicLinkForm
        className={className}
        classNames={classNames}
        callbackURL={callbackURL}
        isSubmitting={isSubmitting}
        localization={localization}
        redirectTo={redirectTo}
        setIsSubmitting={setIsSubmitting}
      />
    ) : emailOTP ? (
      <EmailOTPForm
        className={className}
        classNames={classNames}
        callbackURL={callbackURL}
        isSubmitting={isSubmitting}
        localization={localization}
        otpSeparators={otpSeparators}
        redirectTo={redirectTo}
        setIsSubmitting={setIsSubmitting}
      />
    ) : null;
  }

  if (view === 'TWO_FACTOR') {
    return (
      <TwoFactorForm
        className={className}
        classNames={classNames}
        isSubmitting={isSubmitting}
        localization={localization}
        otpSeparators={otpSeparators}
        redirectTo={redirectTo}
        setIsSubmitting={setIsSubmitting}
      />
    );
  }

  if (view === 'RECOVER_ACCOUNT') {
    return (
      <RecoverAccountForm
        className={className}
        classNames={classNames}
        isSubmitting={isSubmitting}
        localization={localization}
        redirectTo={redirectTo}
        setIsSubmitting={setIsSubmitting}
      />
    );
  }

  if (view === 'MAGIC_LINK') {
    return (
      <MagicLinkForm
        className={className}
        classNames={classNames}
        callbackURL={callbackURL}
        isSubmitting={isSubmitting}
        localization={localization}
        redirectTo={redirectTo}
        setIsSubmitting={setIsSubmitting}
      />
    );
  }

  if (view === 'EMAIL_OTP') {
    return (
      <EmailOTPForm
        className={className}
        classNames={classNames}
        callbackURL={callbackURL}
        isSubmitting={isSubmitting}
        localization={localization}
        redirectTo={redirectTo}
        setIsSubmitting={setIsSubmitting}
      />
    );
  }

  if (view === 'FORGOT_PASSWORD') {
    return (
      <ForgotPasswordForm
        className={className}
        classNames={classNames}
        isSubmitting={isSubmitting}
        localization={localization}
        setIsSubmitting={setIsSubmitting}
      />
    );
  }

  if (view === 'RESET_PASSWORD') {
    return (
      <ResetPasswordForm
        className={className}
        classNames={classNames}
        localization={localization}
      />
    );
  }

  if (view === 'SIGN_UP') {
    return (
      signUpEnabled && (
        <SignUpForm
          className={className}
          classNames={classNames}
          callbackURL={callbackURL}
          isSubmitting={isSubmitting}
          localization={localization}
          redirectTo={redirectTo}
          setIsSubmitting={setIsSubmitting}
        />
      )
    );
  }
}
