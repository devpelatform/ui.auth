'use client';

import type { ReactNode } from 'react';

import { OrganizationUIProvider } from '@pelatform/ui.auth';

export function OrganizationProvider({ children }: { children: ReactNode }) {
  return (
    <OrganizationUIProvider
      apiKey={true}
      // basePath='/organization'
      customRoles={[
        { role: 'developer', label: 'Developer' },
        { role: 'viewer', label: 'Viewer' },
      ]}
      // displayId
      logo={{
        defaultDicebear: true,
      }}
      pathMode="default"
      // viewPaths
    >
      {children}
    </OrganizationUIProvider>
  );
}
