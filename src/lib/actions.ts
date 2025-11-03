'use client';
import {
  doc,
  updateDoc,
  deleteDoc,
  collection,
  addDoc,
} from 'firebase/firestore';
import { db } from '@/firebase/config';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import type { MenuItem, Promotion } from './types';

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
    // Re-throw to be caught by component if needed, but handled globally
    throw permissionError;
  });
};

export const deleteMenuItem = (itemId: string) => {
  const itemRef = doc(db, 'menuItems', itemId);
  return deleteDoc(itemRef).catch(async (serverError) => {
    const permissionError = new FirestorePermissionError({
      path: itemRef.path,
      operation: 'delete',
    });
    errorEmitter.emit('permission-error', permissionError);
    throw permissionError;
  });
};

export const addMenuItem = (item: Omit<MenuItem, 'id'>) => {
  const collectionRef = collection(db, 'menuItems');
  return addDoc(collectionRef, item).catch(async (serverError) => {
    const permissionError = new FirestorePermissionError({
      path: collectionRef.path,
      operation: 'create',
      requestResourceData: item,
    });
    errorEmitter.emit('permission-error', permissionError);
    throw permissionError;
  });
};

export const updateMenuItem = (itemId: string, item: Partial<MenuItem>) => {
  const itemRef = doc(db, 'menuItems', itemId);
  return updateDoc(itemRef, item).catch(async (serverError) => {
    const permissionError = new FirestorePermissionError({
      path: itemRef.path,
      operation: 'update',
      requestResourceData: item,
    });
    errorEmitter.emit('permission-error', permissionError);
    throw permissionError;
  });
};

export const deletePromotion = (promoId: string) => {
  const promoRef = doc(db, 'promotions', promoId);
  return deleteDoc(promoRef).catch(async (serverError) => {
    const permissionError = new FirestorePermissionError({
      path: promoRef.path,
      operation: 'delete',
    });
    errorEmitter.emit('permission-error', permissionError);
    throw permissionError;
  });
};

export const addPromotion = (promo: Omit<Promotion, 'id'>) => {
    const collectionRef = collection(db, 'promotions');
    return addDoc(collectionRef, promo).catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
            path: collectionRef.path,
            operation: 'create',
            requestResourceData: promo,
        });
        errorEmitter.emit('permission-error', permissionError);
        throw permissionError;
    });
};

export const updatePromotion = (promoId: string, promo: Partial<Promotion>) => {
    const promoRef = doc(db, 'promotions', promoId);
    return updateDoc(promoRef, promo).catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
            path: promoRef.path,
            operation: 'update',
            requestResourceData: promo,
        });
        errorEmitter.emit('permission-error', permissionError);
        throw permissionError;
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
    throw permissionError;
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
    throw permissionError;
  });
};
