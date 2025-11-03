'use client';

import { PropsWithChildren, useEffect } from 'react';
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        try {
          const tokenResult = await user.getIdTokenResult();
          const claims = tokenResult.claims;
          setIsAdmin(!!claims.admin);
        } catch (error) {
          console.error("Error getting user token:", error);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const isPublicRoute = publicRoutes.includes(pathname);

    if (!user && !isPublicRoute) {
      router.push('/login');
    } else if (user && isPublicRoute) {
      router.push('/dashboard');
    }
  }, [user, isLoading, pathname, router]);

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
              Please contact your system administrator to request access. Your user email is <strong>{user.email}</strong>.
            </p>
           </CardContent>
           <CardFooter>
             <Button onClick={() => auth.signOut()} className="w-full">Logout</Button>
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
