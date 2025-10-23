'use client';

import { useCallback, useContext, useEffect, useMemo, useRef } from 'react';

import { AuthUIContext, OrganizationContext } from '@/hooks';
import { useActiveOrganization, useListOrganizations, useSession } from '@/hooks/main';
import { organizationViewPaths } from '@/lib/view-paths';
import type { Organization } from '@/types/auth';
import type { AvatarOptions } from '@/types/options';
import type { OrganizationUIProviderProps } from '@/types/organization';

export const LAST_VISITED_ORG = 'last-visited-org';

export const setLastVisitedOrganization = (slug: string, maxAge: number = 30 * 86400) => {
  // biome-ignore lint/suspicious/noDocumentCookie: disable
  document.cookie = `${LAST_VISITED_ORG}=${slug}; max-age=${maxAge}; path=/`;
};

export const OrganizationUIProvider = (options: OrganizationUIProviderProps) => {
  const {
    children,
    apiKey,
    basePath: basePathProp = '/organization',
    customRoles = [],
    displayId,
    logo: logoProp,
    pathMode = 'default',
    personalPath,
    slug,
    viewPaths: viewPathsProp,
  } = options;

  const logo = useMemo<AvatarOptions | undefined>(() => {
    if (!logoProp) return;

    if (logoProp === true) {
      return {
        extension: 'png',
        size: 128,
      };
    }

    return {
      upload: logoProp.upload,
      delete: logoProp.delete,
      extension: logoProp.extension || 'png',
      size: logoProp.size || (logoProp.upload ? 256 : 128),
    };
  }, [logoProp]);

  // Remove trailing slash from basePath
  const basePath = basePathProp.endsWith('/') ? basePathProp.slice(0, -1) : basePathProp;

  const viewPaths = useMemo(() => {
    return { ...organizationViewPaths, ...viewPathsProp };
  }, [viewPathsProp]);

  let data: Organization | null | undefined;
  let isLoading: boolean | undefined;
  let isRefetching: boolean | undefined;
  let refetch: (() => void) | undefined;

  const { authClient, navigate, redirectTo } = useContext(AuthUIContext);

  const {
    data: organizations,
    isPending: organizationsPending,
    isRefetching: organizationsRefetching,
    refetch: refetchListOrganizations,
  } = useListOrganizations(authClient);

  if (pathMode === 'slug') {
    data = organizations?.find((organization) => organization.slug === slug);
    isLoading = organizationsPending;
    isRefetching = organizationsRefetching;
  } else {
    const {
      data: activeOrganization,
      isLoading: organizationPending,
      isRefetching: organizationRefetching,
      refetch: refetchOrganization,
    } = useActiveOrganization(authClient);

    data = activeOrganization;
    isLoading = organizationPending;
    isRefetching = organizationRefetching;
    refetch = refetchOrganization;
  }

  const setLastVisited = useCallback(
    async (org: Partial<Organization>) => {
      try {
        if (org.slug) {
          setLastVisitedOrganization(org.slug);
        }
        if (org.id) {
          await authClient.organization.setActive({ organizationId: org.id });
        }
      } catch (err) {
        console.error('Failed to set last visited org:', err);
      }
    },
    [authClient],
  );

  const { data: sessionData } = useSession(authClient);

  // Ensure we only refetch once per session change to avoid loops
  const hasRefetchedForSessionRef = useRef<string | null>(null);
  useEffect(() => {
    const sessionUserId = sessionData?.user.id || null;
    if (!sessionUserId) return;

    if (hasRefetchedForSessionRef.current === sessionUserId) return;
    hasRefetchedForSessionRef.current = sessionUserId;

    refetch?.();
    refetchListOrganizations?.();
  }, [sessionData?.user.id, refetch, refetchListOrganizations]);

  useEffect(() => {
    if (isLoading || isRefetching) return;

    if (slug && pathMode === 'slug' && !data) {
      navigate(personalPath || redirectTo);
    }
  }, [data, isLoading, isRefetching, slug, pathMode, personalPath, navigate, redirectTo]);

  return (
    <OrganizationContext.Provider
      value={{
        apiKey,
        basePath: basePath === '/' ? '' : basePath,
        currentPath: pathMode === 'slug' ? `/${slug}` : '',
        customRoles,
        data,
        displayId,
        isLoading,
        isPending: isLoading,
        isRefetching,
        logo,
        organizations,
        pathMode,
        personalPath,
        refetch,
        setLastVisited,
        slug,
        viewPaths,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
};
