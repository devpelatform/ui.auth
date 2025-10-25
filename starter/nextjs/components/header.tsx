'use client';

import Link from 'next/link';

import { GithubButton } from '@pelatform/ui/animation';
import { Logo } from '@pelatform/ui/components';
import { UserButton } from '@pelatform/ui.auth';
import { config } from '@/lib/config';
import { LanguageSwitcher } from './language-switcher';
import { ModeToggle } from './mode-toggle';

export function Header() {
  return (
    <header className="sticky top-0 z-50 flex h-12 items-center border-b bg-background/60 backdrop-blur md:h-14">
      <div className="container mx-auto flex justify-between px-5">
        <Link href="/" className="flex items-center gap-2">
          <Logo className="size-6" />
          <span className="font-mono font-semibold">{config.appName}</span>
        </Link>
        <div className="flex items-center gap-2">
          <GithubButton
            targetStars={9999}
            label="Star on GitHub"
            repoUrl="https://github.com/devpelatform/ui.auth"
          />
          <ModeToggle />
          <LanguageSwitcher />
          <UserButton size="icon" align="end" />
        </div>
      </div>
    </header>
  );
}
