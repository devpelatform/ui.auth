import { OrganizationView } from '@pelatform/ui.auth';
import { organizationViewPaths } from '@pelatform/ui.auth/server';
import { OrganizationProvider } from '@/components/organization-provider';

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.values(organizationViewPaths).map((path) => ({ path }));
}

export default async function OraganizationPage({ params }: { params: Promise<{ path: string }> }) {
  const { path } = await params;

  return (
    <OrganizationProvider>
      <main className="mx-auto w-full p-4 md:p-6">
        <OrganizationView path={path} />
      </main>
    </OrganizationProvider>
  );
}
