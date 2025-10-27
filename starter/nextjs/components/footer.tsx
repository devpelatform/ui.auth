'use client';

import { SiteFooter } from '@pelatform/ui/components';
import { config } from '@/lib/config';

export function Footer() {
  return (
    <SiteFooter className="*:justify-center">
      <div className="text-balance text-center text-muted-foreground text-sm leading-loose md:text-left">
        © {new Date().getFullYear()} {config.appName}. All rights reserved.
      </div>
    </SiteFooter>
  );
}
