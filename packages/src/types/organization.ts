import type { ReactNode } from 'react';

import type { OrganizationViewPaths } from '../lib/view-paths';
import type { Organization } from './auth';
import type { AvatarOptions } from './options';

export interface OrganizationLogoOptions extends AvatarOptions {
  defaultDicebear?: boolean;
}

export interface SetLastVisitedOptions {
  organization: Partial<Organization>;
  slug?: string;
  refetch?: boolean;
  refetchList?: boolean;
  disableRedirect?: boolean;
  forceRedirect?: boolean;
  personalPath?: string;
}

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
   * Current organization path
   */
  currentPath: string;
  // /**
  //  * Current organization role
  //  */
  // currentRole?: string | null;
  /**
   * Custom roles to add to the built-in roles (owner, admin, member)
   * @default []
   */
  customRoles: Array<{ role: string; label: string }>;
  /**
   * The current organization
   */
  data: Organization | null | undefined;
  /**
   * Display Organization ID
   * @default true
   */
  displayId: boolean;
  /**
   * Whether the organization is loading
   */
  isLoading: boolean | undefined;
  /**
   * Whether the organization is pending
   */
  isPending: boolean | undefined;
  /**
   * Whether the organization is refetching
   */
  isRefetching: boolean | undefined;
  /**
   * Logo configuration
   * @default undefined
   */
  logo?: OrganizationLogoOptions;
  // /**
  //  * List of organizations
  //  * @default undefined
  //  */
  // organizations?: Organization[] | null | undefined;
  /**
   * Organization path mode
   * @default "default"
   */
  pathMode: 'default' | 'slug';
  // /**
  //  * The path to redirect to when Personal Account is selected
  //  */
  // personalPath?: string;
  /**
   * Refetch the organization
   */
  refetch: (() => void) | undefined;
  /**
   * List of roles
   */
  roles: Array<{ role: string; label: string }>;
  /**
   * Set the last visited organization
   */
  setLastVisited: (options: SetLastVisitedOptions) => Promise<void> | void;
  // /**
  //  * The current organization slug
  //  */
  // slug?: string;
  /**
   * Customize organization view paths
   */
  viewPaths: OrganizationViewPaths;
};

export type OrganizationUIProviderProps = {
  children: ReactNode;
  apiKey?: boolean;
  basePath?: string;
  customRoles?: Array<{ role: string; label: string }>;
  displayId?: boolean;
  logo?: boolean | Partial<OrganizationLogoOptions>;
  pathMode?: 'default' | 'slug';
  // personalPath?: string;
  // slug?: string;
  viewPaths?: Partial<OrganizationViewPaths>;
};
