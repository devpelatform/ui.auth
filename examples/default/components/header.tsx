'use client';

import Link from 'next/link';

import { Logo } from '@pelatform/ui/components';
import { Button } from '@pelatform/ui/default';
import { GitHubIcon, OrganizationSwitcher, UserButton } from '@pelatform/ui.auth';
import { LanguageSwitcher } from './language-switcher';
import { ModeToggle } from './mode-toggle';
import { OrganizationProvider } from './organization-provider';

export function Header() {
  return (
    <header className="sticky top-0 z-50 flex h-12 justify-between border-b bg-background/60 px-safe-or-4 backdrop-blur md:h-14 md:px-safe-or-6">
      <Link href="/" className="flex items-center gap-2">
        <Logo className="size-6" />
        <span>
          <span className="font-semibold">Auth.ui</span> Starter
        </span>
      </Link>

      <div className="flex items-center gap-2">
        <Link href="https://github.com/devpelatform/ui.auth" target="_blank">
          <Button variant="outline" size="icon" className="size-8 rounded-full">
            <GitHubIcon />
          </Button>
        </Link>

        <ModeToggle />
        <LanguageSwitcher />
        <OrganizationProvider>
          <OrganizationSwitcher size="icon" align="end" />
        </OrganizationProvider>
        <UserButton size="icon" align="end" />
      </div>
    </header>
  );
}
