'use client';

import { type ReactNode, useEffect, useMemo, useState } from 'react';

import { Tabs, TabsList, TabsTrigger } from '@pelatform/ui/default';
import { useAuth, useOrganization } from '../../hooks/index';
import { useLocalization } from '../../hooks/private';
import { useAuthenticate } from '../../hooks/use-authenticate';
import { cn } from '../../lib/utils';
import type { OrganizationViewPath } from '../../lib/view-paths';
import { getViewByPath } from '../../lib/view-paths';
import { ApiKeysCard } from '../apikeys/apikeys';
import { OrganizationMembersCards } from './members';
import { OrganizationSettingsCards } from './settings';
import type { OrganizationViewProps } from './types';

export function OrganizationView({
  className,
  classNames,
  localization: localizationProp,
  disableNavigation,
  path: pathProp,
  pathname,
  view: viewProp,
}: OrganizationViewProps) {
  const { navigate, organization: organizationFeature } = useAuth();
  const {
    apiKey,
    basePath,
    currentPath,
    data: organization,
    isPending: organizationPending,
    viewPaths,
  } = useOrganization();

  useAuthenticate();

  const localization = useLocalization(localizationProp);

  const path = pathProp ?? pathname?.split('/').pop();

  const view = viewProp || getViewByPath(viewPaths!, path) || 'SETTINGS';

  useEffect(() => {
    if (!organizationFeature) {
      navigate('/');
    }

    if (!apiKey && view === 'API_KEYS') {
      navigate(`${basePath}${currentPath}/${viewPaths?.SETTINGS}`);
    }
  }, [organizationFeature, apiKey, view, basePath, currentPath, viewPaths.SETTINGS, navigate]);

  const navItems = useMemo(() => {
    const items: {
      view: OrganizationViewPath;
      label: string;
    }[] = [
      { view: 'SETTINGS', label: localization.SETTINGS },
      { view: 'MEMBERS', label: localization.MEMBERS },
    ];

    if (apiKey) {
      items.push({
        view: 'API_KEYS',
        label: localization.API_KEYS,
      });
    }

    return items;
  }, [apiKey, localization.SETTINGS, localization.MEMBERS, localization.API_KEYS]);

  // Local state to instantly update the active tab on click
  const [activeTab, setActiveTab] = useState<string>('');

  // Keep the local state in sync with the current pathname, in case navigation happens externally
  useEffect(() => {
    const found = navItems.findIndex((item) => path === item.view);
    if (found !== -1) {
      setActiveTab(navItems[found].view);
    } else {
      setActiveTab(view);
    }
  }, [navItems, path, view]);

  // Handle tab click: update local state immediately and trigger navigation
  const handleTabClick = (key: string, view: OrganizationViewPath) => {
    setActiveTab(key);
    // Navigate after a short delay (or immediately) so that the UI updates first
    navigate(`${basePath}${currentPath}/${viewPaths[view]}`);
  };

  const navigations = (children: ReactNode) => (
    <div className={cn('container mx-auto max-w-5xl', className, classNames?.nav?.base)}>
      <Tabs
        defaultValue={activeTab}
        value={activeTab}
        className={cn('space-y-5', classNames?.nav?.tabs)}
      >
        <TabsList variant="line" className={classNames?.nav?.tabsList}>
          {navItems.map(({ label, view }) => (
            <TabsTrigger
              key={view}
              value={view}
              className={cn('justify-start', classNames?.nav?.tabsTrigger)}
              onClick={() => handleTabClick(view, view)}
            >
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <div className={cn('mt-6 grow md:mt-8', classNames?.nav?.content)}>{children}</div>
    </div>
  );

  const contents = (
    <>
      {view === 'SETTINGS' && (
        <OrganizationSettingsCards
          className={classNames?.baseCards}
          classNames={classNames?.card}
          localization={localization}
        />
      )}

      {view === 'MEMBERS' && (
        <OrganizationMembersCards
          className={classNames?.baseCards}
          classNames={classNames?.card}
          localization={localization}
        />
      )}

      {apiKey && view === 'API_KEYS' && (
        <ApiKeysCard
          classNames={classNames?.card}
          localization={localization}
          isPending={organizationPending || !organization}
          isOrganization={true}
          organizationId={organization?.id}
        />
      )}
    </>
  );

  if (disableNavigation) {
    return contents;
  }

  return navigations(contents);
}
