'use client';

import { createContext, useContext } from 'react';

import type { createAuthHooks } from '@/lib/create-auth-hooks';
import type { AuthUIOptions } from '@/types/main';
import type { OrganizationContextOptions } from '@/types/organization';
import { type AuthQueryOptions, defaultAuthQueryOptions } from '@/types/query';

export const AuthUIContext = createContext<AuthUIOptions>({} as unknown as AuthUIOptions);

export const AuthQueryContext = createContext<AuthQueryOptions>(defaultAuthQueryOptions);

type AuthHooks = ReturnType<typeof createAuthHooks>;
export const AuthHooksContext = createContext<AuthHooks | null>(null);

export const OrganizationContext = createContext<OrganizationContextOptions | null>(null);

export const useAuth = () => {
  const context = useContext(AuthUIContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthUIProvider');
  }

  return context;
};

export const useAuthClient = () => {
  const context = useContext(AuthUIContext);
  if (!context) {
    throw new Error('useAuthClient must be used within AuthUIProvider');
  }

  return context.authClient;
};

export const useAuthLocalization = () => {
  const context = useContext(AuthUIContext);
  if (!context) {
    throw new Error('useAuthLocalization must be used within AuthUIProvider');
  }

  return context.localization;
};

export const useQuery = () => {
  const context = useContext(AuthQueryContext);
  if (!context) {
    throw new Error('useQuery must be used within AuthUIProvider');
  }

  return context;
};

export const useAuthHooks = () => {
  const context = useContext(AuthHooksContext);
  if (!context) {
    throw new Error('useAuthHooks must be used within AuthUIProvider');
  }

  return context;
};

export const useOrganization = () => {
  const context = useContext(OrganizationContext);
  if (!context) {
    throw new Error(
      'useOrganization must be used within OrganizationUIProvider and AuthUIProvider',
    );
  }

  return context;
};
