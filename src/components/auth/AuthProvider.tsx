'use client';

import { PropsWithChildren, useEffect, useCallback, useState } from 'react';
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

  const checkAdminClaim = useCallback(async (currentUser: User, forceRefresh: boolean = false) => {
    try {
      const tokenResult = await currentUser.getIdTokenResult(forceRefresh);
      const claims = tokenResult.claims;
      console.log('User claims:', claims);
      const hasAdminClaim = !!claims.admin;
      setIsAdmin(hasAdminClaim);
      return hasAdminClaim;
    } catch (error) {
      console.error("Error getting user token:", error);
      setIsAdmin(false);
      return false;
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


  // This effect handles the "Access Denied" case specifically.
  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;

    // If we're on a private route, the user is logged in, but not yet detected as an admin
    if (!isLoading && user && isAdmin === false && !publicRoutes.includes(pathname)) {
        // We'll retry fetching the token every 3 seconds to check for the claim.
        intervalId = setInterval(async () => {
            console.log('Retrying admin check...');
            const hasClaim = await checkAdminClaim(user, true); // Force refresh
            if (hasClaim) {
                // If the claim is found, clear the interval. The user will be let in on the next re-render.
                clearInterval(intervalId);
            }
        }, 3000);
    }
    
    // Cleanup function to clear the interval when the component unmounts or dependencies change.
    return () => {
        if (intervalId) {
            clearInterval(intervalId);
        }
    };
  }, [isLoading, user, isAdmin, pathname, checkAdminClaim]);


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
              Please contact your system administrator to request access. If you were just granted access, this screen will update automatically.
            </p>
           </CardContent>
           <CardFooter>
             <Button onClick={() => auth.signOut()} className="w-full" variant="outline">Logout</Button>
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
