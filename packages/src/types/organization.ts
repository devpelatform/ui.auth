import type { ReactNode } from 'react';
import type { Organization } from 'better-auth/plugins/organization';

import type { OrganizationViewPaths } from '@/lib/view-paths';

export type OrganizationLogoOptions = {
  /**
   * Upload a logo image and return the URL string
   * @remarks `(file: File) => Promise<string>`
   */
  upload?: (file: File) => Promise<string | undefined | null>;
  /**
   * Delete a previously uploaded logo image from your storage/CDN
   * @remarks `(url: string) => Promise<void>`
   */
  delete?: (url: string) => Promise<void>;
  /**
   * Logo size for resizing
   * @default 256 if upload is provided, 128 otherwise
   */
  size: number;
  /**
   * File extension for logo uploads
   * @default "png"
   */
  extension: string;
};

export type OrganizationContextOptions = {
  /**
   * Enable or disable API key support for organizations
   * @default false
   */
  apiKey?: boolean;
  /**
   * Base path for organization-scoped views
   */
  basePath: string;
  /**
   * Custom roles to add to the built-in roles (owner, admin, member)
   * @default []
   */
  customRoles: Array<{ role: string; label: string }>;
  /**
   * Logo configuration
   * @default undefined
   */
  logo?: OrganizationLogoOptions;
  /**
   * Organization path mode
   * @default "default"
   */
  pathMode?: 'default' | 'slug';
  /**
   * The path to redirect to when Personal Account is selected
   */
  personalPath?: string;
  /**
   * The current organization slug
   */
  slug?: string;
  /**
   * Customize organization view paths
   */
  viewPaths: OrganizationViewPaths;
  /**
   * The current organization
   */
  data: Organization | null | undefined;
  /**
   * Whether the organization is loading
   */
  isLoading: boolean | undefined;
  /**
   * Whether the organization is refetching
   */
  isRefetching: boolean | undefined;
  /**
   * Refetch the organization
   */
  refetch: (() => void) | undefined;
  /**
   * Set the last visited organization
   */
  setLastVisited?: (organization: Partial<Organization>) => Promise<void> | void;
};

export type OrganizationUIProviderProps = {
  children: ReactNode;
  apiKey?: boolean;
  basePath?: string;
  customRoles?: Array<{ role: string; label: string }>;
  logo?: boolean | Partial<OrganizationLogoOptions>;
  pathMode?: 'default' | 'slug';
  personalPath?: string;
  slug?: string;
  viewPaths?: Partial<OrganizationViewPaths>;
};
