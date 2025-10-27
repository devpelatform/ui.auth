'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';

import { GithubButton } from '@pelatform/ui/animation';
import { LanguageSwitcher, Logo, ModeSwitcher, SiteHeader } from '@pelatform/ui/components';
import { UserButton } from '@pelatform/ui.auth';
import { config } from '@/lib/config';
import { setUserLocale } from '@/lib/i18n/server';
import type { Locale } from '@/lib/types';

function getAvailableLocales(): Locale[] {
  const availableLocales = Object.keys(config.i18n) as Locale[];
  return availableLocales;
}

export function Header() {
  const currentLocale = useLocale();

  const availableLocales = getAvailableLocales();
  const languages = availableLocales.map((locale: string) => {
    const localeConfig = config.i18n[locale as Locale];
    return {
      code: locale,
      name: localeConfig?.name || locale.toUpperCase(),
      flag: localeConfig?.flag || '',
    };
  });

  function handleLanguageChange(newLocale: string) {
    if (newLocale === currentLocale) {
      return; // No change needed
    }

    setUserLocale(newLocale as Locale);
  }

  return (
    <SiteHeader className="bg-background backdrop-blur-none supports-backdrop-filter:bg-background">
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
        <ModeSwitcher type="dropdown" variant="outline" className="size-8 rounded-full" />
        <LanguageSwitcher
          variant="outline"
          className="size-8 rounded-full"
          currentLocale={currentLocale}
          locales={languages}
          onLocaleChange={handleLanguageChange}
        />
        <UserButton size="icon" align="end" />
      </div>
    </SiteHeader>
  );
}
