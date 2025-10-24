'use client';

import { type ReactNode, useEffect, useMemo, useState } from 'react';

import { Tabs, TabsList, TabsTrigger } from '@pelatform/ui/default';
import { useAuth } from '../../hooks/main';
import { useLocalization } from '../../hooks/private';
import { useAuthenticate } from '../../hooks/use-authenticate';
import { cn } from '../../lib/utils';
import type { AccountViewPath } from '../../lib/view-paths';
import { getViewByPath } from '../../lib/view-paths';
import { ApiKeysCard } from '../apikeys/apikeys';
import { OrganizationsCard } from './organizations';
import { SecurityCards } from './security';
import { SettingsCards } from './settings';
import type { AccountViewProps } from './types';
import { UserInvitationsCard } from './user-invitations';

export function AccountView({
  className,
  classNames,
  localization: localizationProp,
  disableNavigation,
  path: pathProp,
  pathname,
  view: viewProp,
}: AccountViewProps) {
  const { account: accountOptions, apiKey, navigate, organization } = useAuth();

  if (!accountOptions) {
    return null;
  }

  useAuthenticate();

  const localization = useLocalization(localizationProp);

  const path = pathProp ?? pathname?.split('/').pop();
  const view = viewProp || getViewByPath(accountOptions.viewPaths, path!) || 'SETTINGS';

  useEffect(() => {
    if (!apiKey && view === 'API_KEYS') {
      navigate(`${accountOptions?.basePath}/${accountOptions?.viewPaths?.SETTINGS}`);
    }

    if (!organization && view === 'ORGANIZATIONS') {
      navigate(`${accountOptions?.basePath}/${accountOptions?.viewPaths?.SETTINGS}`);
    }
  }, [apiKey, organization, view, accountOptions?.basePath, accountOptions?.viewPaths, navigate]);

  const navItems = useMemo(() => {
    const items: {
      view: AccountViewPath;
      label: string;
    }[] = [
      { view: 'SETTINGS', label: localization.ACCOUNT },
      { view: 'SECURITY', label: localization.SECURITY },
    ];

    if (apiKey) {
      items.push({
        view: 'API_KEYS',
        label: localization.API_KEYS,
      });
    }

    if (organization) {
      items.push({
        view: 'ORGANIZATIONS',
        label: localization.ORGANIZATIONS,
      });
    }

    return items;
  }, [
    apiKey,
    organization,
    localization.ACCOUNT,
    localization.SECURITY,
    localization.API_KEYS,
    localization.ORGANIZATIONS,
  ]);

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
  const handleTabClick = (key: string, view: AccountViewPath) => {
    setActiveTab(key);
    // Navigate after a short delay (or immediately) so that the UI updates first
    navigate(`${accountOptions?.basePath}/${accountOptions?.viewPaths[view]}`);
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
        <SettingsCards
          className={classNames?.baseCards}
          classNames={classNames?.card}
          localization={localization}
        />
      )}

      {view === 'SECURITY' && (
        <SecurityCards
          className={classNames?.baseCards}
          classNames={classNames?.card}
          localization={localization}
        />
      )}

      {apiKey && view === 'API_KEYS' && (
        <ApiKeysCard classNames={classNames?.card} localization={localization} />
      )}

      {organization && view === 'ORGANIZATIONS' && (
        <div className="grid w-full gap-6 md:gap-8">
          <OrganizationsCard classNames={classNames?.card} localization={localization} />
          <UserInvitationsCard classNames={classNames?.card} localization={localization} />
        </div>
      )}
    </>
  );

  if (disableNavigation) {
    return contents;
  }

  return navigations(contents);
}
