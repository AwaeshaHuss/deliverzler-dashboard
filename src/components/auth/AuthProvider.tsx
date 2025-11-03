'use client';

import { PropsWithChildren, useEffect, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { app } from '@/firebase/firebase';
import { Skeleton } from '../ui/skeleton';
import { useState } from 'react';
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

  const checkAdminClaim = useCallback(async (user: User, forceRefresh: boolean = false) => {
    try {
      const tokenResult = await user.getIdTokenResult(forceRefresh);
      const claims = tokenResult.claims;
      console.log('User claims:', claims);
      setIsAdmin(!!claims.admin);
    } catch (error) {
      console.error("Error getting user token:", error);
      setIsAdmin(false);
    }
  }, []);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        await checkAdminClaim(user);
      } else {
        setIsAdmin(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [checkAdminClaim]);

  useEffect(() => {
    if (isLoading) return;

    const isPublicRoute = publicRoutes.includes(pathname);

    if (!user && !isPublicRoute) {
      router.push('/login');
    } else if (user && isPublicRoute) {
      router.push('/dashboard');
    }
  }, [user, isLoading, pathname, router]);

  const handleRetry = useCallback(async () => {
    if (user) {
      setIsLoading(true);
      await checkAdminClaim(user, true); // Force refresh token
      setIsLoading(false);
    }
  }, [user, checkAdminClaim]);

  if (isLoading || (!user && !publicRoutes.includes(pathname))) {
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

  if (user && isAdmin === false && !publicRoutes.includes(pathname)) {
    return (
       <div className="flex h-screen w-screen items-center justify-center bg-background p-4">
         <Card className="w-full max-w-md mx-auto shadow-2xl">
           <CardHeader>
             <CardTitle className="font-headline text-2xl text-destructive">Access Denied</CardTitle>
             <CardDescription>You do not have administrative privileges to access this dashboard.</CardDescription>
           </CardHeader>
           <CardContent>
            <p className="text-sm text-muted-foreground">
              Please contact your system administrator to request access. If you have just been granted access, please wait a moment and try again.
            </p>
           </CardContent>
           <CardFooter className="flex-col sm:flex-row gap-2">
             <Button onClick={handleRetry} className="w-full sm:w-auto">Retry</Button>
             <Button onClick={() => auth.signOut()} className="w-full sm:w-auto" variant="outline">Logout</Button>
           </CardFooter>
         </Card>
       </div>
    )
  }

    if (user && isAdmin === null && !publicRoutes.includes(pathname)) {
    // Still checking claims
     return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="w-full max-w-sm space-y-4 p-4">
            <p className='text-center text-muted-foreground'>Verifying permissions...</p>
        </div>
      </div>
    );
  }


  return <>{children}</>;
}
