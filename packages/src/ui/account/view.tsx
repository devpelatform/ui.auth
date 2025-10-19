'use client';

import { useMemo } from 'react';
import { MenuIcon } from 'lucide-react';

import {
  Button,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  Label,
} from '@pelatform/ui/default';
import { useAuth } from '@/hooks';
import { useAuthenticate } from '@/hooks/use-authenticate';
import type { AuthLocalization } from '@/lib/localization';
import { cn } from '@/lib/utils';
import type { AccountViewPath } from '@/lib/view-paths';
import { getViewByPath } from '@/lib/view-paths';
import { ApiKeysCard } from '../apikeys/apikeys';
import type { SettingsCardClassNames } from '../shared/settings-card';
import { SecurityCards } from './security';
import { SettingsCards } from './settings';

export interface AccountViewProps {
  className?: string;
  classNames?: {
    base?: string;
    cards?: string;
    drawer?: { menuItem?: string };
    sidebar?: { base?: string; button?: string; buttonActive?: string };
    card?: SettingsCardClassNames;
  };
  localization?: AuthLocalization;
  path?: string;
  pathname?: string;
  view?: AccountViewPath;
  hideNav?: boolean;
}

export function AccountView({
  className,
  classNames,
  localization: localizationProp,
  path: pathProp,
  pathname,
  view: viewProp,
  hideNav,
}: AccountViewProps) {
  const { account: accountOptions, apiKey, localization: localizationContext, Link } = useAuth();

  if (!accountOptions) {
    return null;
  }

  useAuthenticate();

  const localization = useMemo(
    () => ({ ...localizationContext, ...localizationProp }),
    [localizationContext, localizationProp],
  );

  const path = pathProp ?? pathname?.split('/').pop();

  const view = viewProp || getViewByPath(accountOptions.viewPaths, path!) || 'SETTINGS';

  const navItems: {
    view: AccountViewPath;
    label: string;
  }[] = [
    { view: 'SETTINGS', label: localization.ACCOUNT },
    { view: 'SECURITY', label: localization.SECURITY },
  ];

  if (apiKey) {
    navItems.push({
      view: 'API_KEYS',
      label: localization.API_KEYS,
    });
  }

  return (
    <div
      className={cn(
        'flex w-full grow flex-col gap-4 md:flex-row md:gap-12',
        className,
        classNames?.base,
      )}
    >
      {!hideNav && (
        <div className="flex justify-between gap-2 md:hidden">
          <Label className="font-semibold text-base">
            {navItems.find((i) => i.view === view)?.label}
          </Label>

          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="outline">
                <MenuIcon />
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle className="hidden">{localization.SETTINGS}</DrawerTitle>
              </DrawerHeader>
              <div className="flex flex-col px-4 pb-4">
                {navItems.map((item) => (
                  <Link
                    key={item.view}
                    href={`${accountOptions?.basePath}/${accountOptions?.viewPaths[item.view]}`}
                  >
                    <Button
                      size="lg"
                      className={cn(
                        'w-full justify-start px-4 transition-none',
                        classNames?.drawer?.menuItem,
                        view === item.view ? 'font-semibold' : 'text-foreground/70',
                      )}
                      variant="ghost"
                    >
                      {item.label}
                    </Button>
                  </Link>
                ))}
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      )}

      {!hideNav && (
        <div className="hidden md:block">
          <div className={cn('flex w-48 flex-col gap-1 lg:w-60', classNames?.sidebar?.base)}>
            {navItems.map((item) => (
              <Link
                key={item.view}
                href={`${accountOptions?.basePath}/${accountOptions?.viewPaths[item.view]}`}
              >
                <Button
                  size="lg"
                  className={cn(
                    'w-full justify-start px-4 transition-none',
                    classNames?.sidebar?.button,
                    view === item.view ? 'font-semibold' : 'text-foreground/70',
                    view === item.view && classNames?.sidebar?.buttonActive,
                  )}
                  variant="ghost"
                >
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      )}

      {view === 'SETTINGS' && <SettingsCards classNames={classNames} localization={localization} />}

      {view === 'SECURITY' && <SecurityCards classNames={classNames} localization={localization} />}

      {view === 'API_KEYS' && (
        <ApiKeysCard classNames={classNames?.card} localization={localization} />
      )}
    </div>
  );
}
