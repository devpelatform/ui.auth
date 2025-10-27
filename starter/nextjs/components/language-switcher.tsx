'use client';

import { useTransition } from 'react';
import Image from 'next/image';
import { Globe, Languages } from 'lucide-react';
import { useLocale } from 'next-intl';

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@pelatform/ui/default';
import { cn } from '@pelatform/utils';
import { config } from '@/lib/config';
import { setUserLocale } from '@/lib/i18n/server';
import type { Locale } from '@/lib/types';

function getAvailableLocales(): Locale[] {
  const availableLocales = Object.keys(config.i18n) as Locale[];
  return availableLocales;
}

interface LanguageSwitcherProps {
  showNames?: boolean;
  showFlags?: boolean;
}

export function LanguageSwitcher({ showNames = true, showFlags = true }: LanguageSwitcherProps) {
  const currentLocale = useLocale();
  const [isPending, startTransition] = useTransition();

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

    startTransition(() => {
      setUserLocale(newLocale as Locale);
    });
  }

  if (availableLocales.length <= 1) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="size-8 rounded-full">
          <Languages className="size-4" />
          <span className="sr-only">
            {isPending ? 'Changing language...' : 'Language dropdown'}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        onCloseAutoFocus={(e) => e.preventDefault()}
        className="min-w-[150px]"
      >
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={cn('gap-2', currentLocale === lang.code && 'bg-accent')}
          >
            {showFlags && lang.flag ? (
              <Image
                src={`/flags/${lang.flag}.svg`}
                alt={`${lang.name} flag`}
                className="size-4 rounded-full object-cover"
                width={24}
                height={24}
                loading="lazy"
              />
            ) : showFlags ? (
              <Globe className="size-4" />
            ) : null}
            {showNames && <span className="text-sm">{lang.name}</span>}
            {currentLocale === lang.code && (
              <span className="ms-auto text-muted-foreground text-xs">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
