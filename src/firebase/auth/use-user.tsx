'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { useAuth } from '@/firebase/provider';

type UserState = {
  user: User | null;
  isAdmin: boolean | null;
  isLoading: boolean;
};

export function useUser() {
  const auth = useAuth();
  const [userState, setUserState] = useState<UserState>({
    user: null,
    isAdmin: null,
    isLoading: true,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const tokenResult = await user.getIdTokenResult(true);
          const isAdmin = !!tokenResult.claims.admin;
          setUserState({ user, isAdmin, isLoading: false });
        } catch (error) {
          console.error("Error fetching user token:", error);
          setUserState({ user, isAdmin: false, isLoading: false });
        }
      } else {
        setUserState({ user: null, isAdmin: false, isLoading: false });
      }
    });

    return () => unsubscribe();
  }, [auth]);

  return userState;
}
