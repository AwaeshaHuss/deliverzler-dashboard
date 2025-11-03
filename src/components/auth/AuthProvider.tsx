'use client';

import { PropsWithChildren, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { app } from '@/firebase/firebase';
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

const auth = getAuth(app);

const publicRoutes = ['/login'];

export default function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Hardcoded check for the specific admin UID
        if (currentUser.uid === 'wJ1knb3sNmcftPOEdWfvcORtUZz2') {
          setIsAdmin(true);
        } else {
          // Fallback to checking custom claims for other potential admins
          try {
            const tokenResult = await currentUser.getIdTokenResult(true);
            const hasAdminClaim = !!tokenResult.claims.admin;
            setIsAdmin(hasAdminClaim);
          } catch (error) {
            console.error("Error refreshing user token:", error);
            setIsAdmin(false); // Default to not admin on error
          }
        }
      } else {
        // No user, not an admin
        setIsAdmin(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

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

  // If on a protected route, but user is not an admin, show Access Denied.
  if (isProtectedRoute && isAdmin === false) {
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

  // If on a protected route and we're still checking admin status, show a brief loading state.
  if (isProtectedRoute && user && isAdmin === null) {
     return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="w-full max-w-sm space-y-4 p-4">
            <p className='text-center text-muted-foreground'>Verifying permissions...</p>
        </div>
      </div>
    );
  }

  // If we are on a public route, or if we are on a protected route and the user is an admin, render the children
  if (!isProtectedRoute || (isProtectedRoute && isAdmin)) {
    return <>{children}</>;
  }
  
  // Fallback for any other state (e.g. redirecting)
  return null;
}
