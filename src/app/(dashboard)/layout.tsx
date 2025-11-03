import type { PropsWithChildren } from 'react';
import AppHeader from '@/components/layout/AppHeader';
import AppSidebar from '@/components/layout/AppSidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import AuthProvider from '@/components/auth/AuthProvider';
import FirebaseErrorListener from '@/components/FirebaseErrorListener';

export default function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <FirebaseClientProvider>
      <AuthProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset className="flex flex-col !m-0 !rounded-none !shadow-none">
            <AppHeader />
            <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
              {children}
            </main>
          </SidebarInset>
        </SidebarProvider>
      </AuthProvider>
      <FirebaseErrorListener />
    </FirebaseClientProvider>
  );
}
