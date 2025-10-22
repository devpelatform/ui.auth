'use client';

import type { ReactNode } from 'react';

import { OrganizationUIProvider } from '@pelatform/ui.auth';

export function OrganizationProvider({ children }: { children: ReactNode }) {
  return (
    <OrganizationUIProvider
      apiKey={true}
      // basePath='/organization'
      // customRoles
      logo={{
        upload: async (file: File) => {
          const formData = new FormData();
          formData.append('avatar', file);
          const res = await fetch('/api/workspace/logo', { method: 'POST', body: formData });
          const { file: uploadedFile } = await res.json();
          return uploadedFile.url;
        },
        delete: async (url: string) => {
          await fetch('/api/workspace/logo', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url }),
          });
        },
      }}
      pathMode="default"
      // personalPath
      // slug='test'
      // viewPaths
    >
      {children}
    </OrganizationUIProvider>
  );
}
