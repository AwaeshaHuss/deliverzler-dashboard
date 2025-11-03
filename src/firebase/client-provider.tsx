'use client';

import { PropsWithChildren, useEffect, useState } from 'react';
import { FirebaseProvider, type FirebaseServices } from '@/firebase/provider';
import { initializeFirebase } from '@/firebase';

export function FirebaseClientProvider({ children }: PropsWithChildren) {
  const [services, setServices] = useState<FirebaseServices | null>(null);

  useEffect(() => {
    // Firebase should only be initialized on the client.
    const newServices = initializeFirebase();
    setServices(newServices);
  }, []);

  if (!services) {
    // Show a loading screen while Firebase is initializing.
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return <FirebaseProvider {...services}>{children}</FirebaseProvider>;
}
