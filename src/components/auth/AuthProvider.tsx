'use client';

import { PropsWithChildren, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth, useUser } from '@/firebase';
import { Skeleton } from '../ui/skeleton';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '../ui/button';

const publicRoutes = ['/login'];

export default function AuthProvider({ children }: PropsWithChildren) {
  const { user, isAdmin, isLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return; // Don't do anything while loading

    const isProtectedRoute = !publicRoutes.includes(pathname);

    // If no user and trying to access a protected route, redirect to login.
    if (!user && isProtectedRoute) {
      router.push('/login');
    }

    // If user is logged in and tries to access a public route (login page), redirect to dashboard.
    if (user && !isProtectedRoute) {
      router.push('/dashboard');
    }
  }, [isLoading, user, pathname, router]);

  // While loading, show a skeleton screen.
  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="w-full max-w-sm space-y-4">
            <Skeleton className="h-10 w-10 mx-auto rounded-full" />
            <Skeleton className="h-8 w-48 mx-auto" />
            <Skeleton className="h-6 w-64 mx-auto" />
            <div className="space-y-2 pt-4">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
            </div>
             <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-10 w-full mt-2" />
        </div>
      </div>
    );
  }

  const isProtectedRoute = !publicRoutes.includes(pathname);
  
  // Hardcoded check for the specific admin UID
  const finalIsAdmin = isAdmin || user?.uid === 'wJ1knb3sNmcftPOEdWfvcORtUZz2';

  // If on a protected route, but user is not an admin, show Access Denied.
  if (isProtectedRoute && !finalIsAdmin) {
    return (
       <div className="flex h-screen w-screen items-center justify-center bg-background p-4">
         <Card className="w-full max-w-md mx-auto shadow-2xl">
           <CardHeader>
             <CardTitle className="font-headline text-2xl text-destructive">Access Denied</CardTitle>
             <CardDescription>You do not have administrative privileges to access this dashboard.</CardDescription>
           </CardHeader>
           <CardContent>
            <p className="text-sm text-muted-foreground">
              Please contact your system administrator to request access. If your admin privileges were just granted, please log out and sign back in.
            </p>
           </CardContent>
           <CardFooter>
             <Button onClick={() => auth.signOut()} className="w-full" variant="outline">Logout</Button>
           </CardFooter>
         </Card>
       </div>
    );
  }

    // If we are on a public route, or if we are on a protected route and the user is an admin, render the children
  if (!isProtectedRoute || (isProtectedRoute && finalIsAdmin)) {
    return <>{children}</>;
  }

  // Fallback for any other state (e.g. redirecting)
  return null;
}
