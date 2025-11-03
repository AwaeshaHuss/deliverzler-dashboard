'use client';

import {
  onSnapshot,
  query,
  collection,
  where,
  type DocumentData,
  type Firestore,
  type Query,
} from 'firebase/firestore';
import { useEffect, useState, useMemo } from 'react';
import { useFirestore } from '@/firebase/provider';

type CollectionState<T> = {
  data: T[] | null;
  isLoading: boolean;
  error: Error | null;
};

export function useCollection<T extends DocumentData>(collectionPath: string) {
  const firestore = useFirestore();
  const [state, setState] = useState<CollectionState<T>>({
    data: null,
    isLoading: true,
    error: null,
  });

  const collectionRef = useMemo(
    () => collection(firestore, collectionPath),
    [firestore, collectionPath]
  );

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collectionRef,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as T[];
        setState({ data, isLoading: false, error: null });
      },
      (error) => {
        console.error('Error fetching collection:', error);
        setState({ data: null, isLoading: false, error });
      }
    );

    return () => unsubscribe();
  }, [collectionRef]);

  return state;
}
