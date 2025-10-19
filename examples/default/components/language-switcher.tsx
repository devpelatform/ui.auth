'use client';

import { useTransition } from 'react';
import Image from 'next/image';
import { Globe, Languages } from 'lucide-react';
import { useLocale } from 'next-intl';

import { getFlagUrl } from '@pelatform/ui';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@pelatform/ui/default';
import { cn } from '@pelatform/utils';
import { getAvailableLocales, getLocaleConfig, isEnable } from '@repo/i18n';
import type { Locale } from '@repo/i18n/types';
import { setUserLocale } from '@/lib/i18n/server';

interface LanguageSwitcherProps {
  className?: string;
  showNames?: boolean;
  showFlags?: boolean;
}

export function LanguageSwitcher({
  className,
  showNames = true,
  showFlags = true,
}: LanguageSwitcherProps) {
  const currentLocale = useLocale();
  const [isPending, startTransition] = useTransition();

  const availableLocales = getAvailableLocales();
  const languages = availableLocales.map((locale: string) => {
    const localeConfig = getLocaleConfig(locale as Locale);
    return {
      code: locale,
      name: localeConfig?.name || locale.toUpperCase(),
      flag: localeConfig?.flag || '',
      currency: localeConfig?.currency || 'USD',
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

  // Don't render if i18n is disabled and only one language is available
  if (!isEnable() && availableLocales.length <= 1) {
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
            className={cn('cursor-pointer gap-2', currentLocale === lang.code && 'bg-accent')}
          >
            {showFlags && lang.flag ? (
              <Image
                src={getFlagUrl(lang.flag)}
                alt={`${lang.name} flag`}
                className="size-4 rounded-full object-cover"
                loading="lazy"
              />
            ) : showFlags ? (
              <Globe className="size-4" />
            ) : null}
            {showNames && <span className="text-sm">{lang.name}</span>}
            {currentLocale === lang.code && (
              <span className="ml-auto text-muted-foreground text-xs">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
