import { AccountView } from '@pelatform/ui.auth';
import { accountViewPaths } from '@pelatform/ui.auth/server';
import { OrganizationProvider } from '@/components/organization-provider';

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.values(accountViewPaths).map((path) => ({ path }));
}

export default async function AccountPage({ params }: { params: Promise<{ path: string }> }) {
  const { path } = await params;

  return (
    <main className="mx-auto w-full p-4 md:p-6">
      {path === 'organizations' ? (
        <OrganizationProvider>
          <AccountView path={path} />
        </OrganizationProvider>
      ) : (
        <AccountView path={path} />
      )}
    </main>
  );
}
