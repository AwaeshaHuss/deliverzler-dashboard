'use client';

import {
  onSnapshot,
  doc,
  type DocumentData,
  type Firestore,
} from 'firebase/firestore';
import { useEffect, useState, useMemo } from 'react';
import { useFirestore } from '@/firebase/provider';

type DocState<T> = {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
};

export function useDoc<T extends DocumentData>(docPath: string) {
  const firestore = useFirestore();
  const [state, setState] = useState<DocState<T>>({
    data: null,
    isLoading: true,
    error: null,
  });

  const docRef = useMemo(
    () => doc(firestore, docPath),
    [firestore, docPath]
  );

  useEffect(() => {
    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = { id: snapshot.id, ...snapshot.data() } as T;
          setState({ data, isLoading: false, error: null });
        } else {
          setState({ data: null, isLoading: false, error: new Error('Document does not exist') });
        }
      },
      (error) => {
        console.error('Error fetching document:', error);
        setState({ data: null, isLoading: false, error });
      }
    );

    return () => unsubscribe();
  }, [docRef]);

  return state;
}
