'use client';
import {
  doc,
  updateDoc,
  deleteDoc,
  collection,
  addDoc,
  type Firestore,
} from 'firebase/firestore';
import { db } from '@/firebase/config';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export const updateDriverStatus = (
  driverId: string,
  status: 'Approved' | 'Rejected'
) => {
  const driverRef = doc(db, 'drivers', driverId);
  updateDoc(driverRef, { status }).catch(async (serverError) => {
    const permissionError = new FirestorePermissionError({
      path: driverRef.path,
      operation: 'update',
      requestResourceData: { status },
    });
    errorEmitter.emit('permission-error', permissionError);
  });
};

export const deleteMenuItem = (itemId: string) => {
  const itemRef = doc(db, 'menuItems', itemId);
  deleteDoc(itemRef).catch(async (serverError) => {
    const permissionError = new FirestorePermissionError({
      path: itemRef.path,
      operation: 'delete',
    });
    errorEmitter.emit('permission-error', permissionError);
  });
};

export const addMenuItem = (item: any) => {
  const collectionRef = collection(db, 'menuItems');
  addDoc(collectionRef, item).catch(async (serverError) => {
    const permissionError = new FirestorePermissionError({
      path: collectionRef.path,
      operation: 'create',
      requestResourceData: item,
    });
    errorEmitter.emit('permission-error', permissionError);
  });
};

export const updateMenuItem = (itemId: string, item: any) => {
  const itemRef = doc(db, 'menuItems', itemId);
  updateDoc(itemRef, item).catch(async (serverError) => {
    const permissionError = new FirestorePermissionError({
      path: itemRef.path,
      operation: 'update',
      requestResourceData: item,
    });
    errorEmitter.emit('permission-error', permissionError);
  });
};

export const deletePromotion = (promoId: string) => {
  const promoRef = doc(db, 'promotions', promoId);
  deleteDoc(promoRef).catch(async (serverError) => {
    const permissionError = new FirestorePermissionError({
      path: promoRef.path,
      operation: 'delete',
    });
    errorEmitter.emit('permission-error', permissionError);
  });
};

export const addPromotion = (promo: any) => {
    const collectionRef = collection(db, 'promotions');
    addDoc(collectionRef, promo).catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
            path: collectionRef.path,
            operation: 'create',
            requestResourceData: promo,
        });
        errorEmitter.emit('permission-error', permissionError);
    });
};

export const updatePromotion = (promoId: string, promo: any) => {
    const promoRef = doc(db, 'promotions', promoId);
    updateDoc(promoRef, promo).catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
            path: promoRef.path,
            operation: 'update',
            requestResourceData: promo,
        });
        errorEmitter.emit('permission-error', permissionError);
    });
};


export const hideReview = (reviewId: string) => {
  const reviewRef = doc(db, 'reviews', reviewId);
  deleteDoc(reviewRef).catch(async (serverError) => {
    const permissionError = new FirestorePermissionError({
      path: reviewRef.path,
      operation: 'delete',
    });
    errorEmitter.emit('permission-error', permissionError);
  });
};

export const updateUserStatus = (
  userId: string,
  status: 'Active' | 'Blocked'
) => {
  const userRef = doc(db, 'users', userId);
  updateDoc(userRef, { status }).catch(async (serverError) => {
    const permissionError = new FirestorePermissionError({
      path: userRef.path,
      operation: 'update',
      requestResourceData: { status },
    });
    errorEmitter.emit('permission-error', permissionError);
  });
};
