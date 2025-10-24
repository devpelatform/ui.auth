'use client';

import { createContext, useContext } from 'react';

import type { AuthUIOptions } from '../types/main';
import type { OrganizationContextOptions } from '../types/organization';
import { type AuthQueryOptions, defaultAuthQueryOptions } from '../types/query';

export const AuthUIContext = createContext<AuthUIOptions>({} as unknown as AuthUIOptions);

export const AuthQueryContext = createContext<AuthQueryOptions>(defaultAuthQueryOptions);

export const OrganizationContext = createContext<OrganizationContextOptions | null>(null);

export const useAuth = () => {
  const context = useContext(AuthUIContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthUIProvider');
  }

  return context;
};

export const useQuery = () => {
  const context = useContext(AuthQueryContext);
  if (!context) {
    throw new Error('useQuery must be used within AuthUIProvider');
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
