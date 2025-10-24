'use client';

import type { ReactNode } from 'react';

import { useAuthenticate } from '../../hooks/use-authenticate';
import { useSession } from '../../hooks/use-session';

/**
 * Conditionally renders content during authentication loading state
 *
 * Renders its children only when the authentication state is being determined
 * (during the loading/pending phase). Once the authentication state is resolved,
 * nothing is rendered. Useful for displaying loading indicators or temporary
 * content while waiting for the authentication check to complete.
 */
export function AuthLoading({ children }: { children: ReactNode }) {
  const { isPending } = useSession();

  return isPending ? children : null;
}

/**
 * Redirects the user to the sign-in page
 *
 * Renders nothing and automatically redirects the current user to the authentication
 * sign-in page. Useful for protecting routes that require authentication or
 * redirecting users to sign in from various parts of the application.
 */
export function RedirectToSignIn(): ReactNode {
  useAuthenticate({ authView: 'SIGN_IN' });
  return null;
}

/**
 * Redirects the user to the sign-up page
 *
 * Renders nothing and automatically redirects the current user to the authentication
 * sign-up page. Useful for directing new users to create an account or
 * for redirecting from marketing pages to the registration flow.
 */
export function RedirectToSignUp(): ReactNode {
  useAuthenticate({ authView: 'SIGN_UP' });
  return null;
}

/**
 * Conditionally renders content for authenticated users only
 *
 * Renders its children only when a user is authenticated with a valid session.
 * If no session exists, nothing is rendered. Useful for displaying protected
 * content or UI elements that should only be visible to signed-in users.
 */
export function SignedIn({ children }: { children: ReactNode }) {
  const { data } = useSession();

  return data ? children : null;
}

/**
 * Conditionally renders content for unauthenticated users only
 *
 * Renders its children only when no user is authenticated and the authentication
 * state is not pending. If a session exists or is being loaded, nothing is rendered.
 * Useful for displaying sign-in prompts or content exclusive to guests.
 */
export function SignedOut({ children }: { children: ReactNode }) {
  const { isPending, data } = useSession();

  return !data && !isPending ? children : null;
}
