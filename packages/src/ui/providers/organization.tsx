'use client';

import { useCallback, useContext, useEffect, useMemo, useRef } from 'react';

import { useActiveOrganization, useListOrganizations, useSession } from '../../hooks/default';
import { AuthUIContext, OrganizationContext } from '../../hooks/main';
import { organizationViewPaths } from '../../lib/view-paths';
import type { Organization } from '../../types/auth';
import type { AvatarOptions } from '../../types/options';
import type { OrganizationUIProviderProps } from '../../types/organization';

export const LAST_VISITED_ORG = 'last-visited-org';

export const setLastVisitedOrganization = (slug: string, maxAge: number = 30 * 86400) => {
  if (typeof document === 'undefined') return;
  // biome-ignore lint/suspicious/noDocumentCookie: disable
  document.cookie = `${LAST_VISITED_ORG}=${slug}; max-age=${maxAge}; path=/`;
};

export const getLastVisitedOrganization = (): string | null => {
  if (typeof document === 'undefined') return null;
  const prefix = `${LAST_VISITED_ORG}=`;
  const cookies = document.cookie ? document.cookie.split('; ') : [];
  for (const cookie of cookies) {
    if (cookie.startsWith(prefix)) {
      return decodeURIComponent(cookie.substring(prefix.length));
    }
  }
  return null;
};

export const clearLastVisitedOrganization = (): void => {
  if (typeof document === 'undefined') return;
  // biome-ignore lint/suspicious/noDocumentCookie: disable
  document.cookie = `${LAST_VISITED_ORG}=; max-age=0; path=/`;
};

export const OrganizationUIProvider = (options: OrganizationUIProviderProps) => {
  const {
    children,
    apiKey,
    basePath: basePathProp = '/organization',
    customRoles = [],
    displayId = true,
    logo: logoProp,
    pathMode = 'default',
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

  const { authClient, localization, navigate } = useContext(AuthUIContext);

  const {
    data: activeOrganization,
    isLoading: organizationPending,
    isRefetching: organizationRefetching,
    refetch: refetchOrganization,
  } = useActiveOrganization(authClient);
  const { refetch: refetchListOrganizations } = useListOrganizations(authClient);

  const setLastVisited = useCallback(
    async (options: {
      organization: Partial<Organization>;
      refetch?: boolean;
      refetchList?: boolean;
      forceRedirect?: boolean;
      personalPath?: string;
    }) => {
      const {
        organization,
        refetch = true,
        refetchList = false,
        forceRedirect = false,
        personalPath,
      } = options;
      try {
        const pathname = window.location.pathname;
        const oldOrgSlug = getLastVisitedOrganization();
        const baseOrgPath = pathMode === 'slug' ? `${basePath}/${organization?.slug}` : basePath;

        if (personalPath) {
          clearLastVisitedOrganization();
        } else if (organization?.slug) {
          setLastVisitedOrganization(organization.slug);
        }

        await authClient.organization.setActive({
          organizationId: organization?.id || null,
          fetchOptions: {
            throw: true,
          },
        });

        if (refetch) {
          await refetchOrganization?.();
        }

        if (refetchList) {
          await refetchListOrganizations?.();
        }

        if (forceRedirect) {
          navigate(`${baseOrgPath}/${viewPaths?.SETTINGS}`);
          return;
        }

        if (personalPath) {
          navigate(personalPath);
          return;
        }

        if (pathMode === 'slug') {
          if (oldOrgSlug !== '' && pathname.includes(oldOrgSlug as string)) {
            const marker = `/${oldOrgSlug}`;
            const idx = pathname.indexOf(marker);
            const after = idx !== -1 ? pathname.slice(idx + marker.length) : '';
            navigate(`${baseOrgPath}${after}`);
          } else {
            navigate(`${baseOrgPath}/${viewPaths?.SETTINGS}`);
          }
        }
      } catch (err) {
        console.error('Failed to set last visited org:', err);
      }
    },
    [
      authClient,
      basePath,
      navigate,
      pathMode,
      refetchOrganization,
      refetchListOrganizations,
      viewPaths?.SETTINGS,
    ],
  );

  const { data: sessionData } = useSession(authClient);

  // Ensure we only refetch once per session change to avoid loops
  const hasRefetchedForSessionRef = useRef<string | null>(null);
  useEffect(() => {
    const sessionUserId = sessionData?.user.id || null;
    if (!sessionUserId) return;

    if (hasRefetchedForSessionRef.current === sessionUserId) return;
    hasRefetchedForSessionRef.current = sessionUserId;

    refetchOrganization?.();
    refetchListOrganizations?.();
  }, [sessionData?.user.id, refetchOrganization, refetchListOrganizations]);

  const builtInRoles = [
    { role: 'owner', label: localization.OWNER },
    { role: 'admin', label: localization.ADMIN },
    { role: 'member', label: localization.MEMBER },
  ];

  const roles = [...builtInRoles, ...(customRoles || [])];

  // const [currentRole, setCurrentRole] = useState<string | undefined>(undefined);
  // useEffect(() => {
  //   (async () => {
  //     const { data } = await authClient.organization.getActiveMemberRole();
  //     setCurrentRole(data?.role || undefined);
  //   })();
  // }, [authClient]);

  return (
    <OrganizationContext.Provider
      value={{
        apiKey,
        basePath: basePath === '/' ? '' : basePath,
        currentPath: pathMode === 'slug' ? `/${activeOrganization?.slug}` : '',
        customRoles,
        data: activeOrganization,
        displayId,
        isLoading: organizationPending,
        isPending: organizationPending,
        isRefetching: organizationRefetching,
        logo,
        pathMode,
        refetch: refetchOrganization,
        roles,
        setLastVisited,
        viewPaths,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
};
