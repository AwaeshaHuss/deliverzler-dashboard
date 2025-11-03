'use client';
import {
  doc,
  updateDoc,
  deleteDoc,
  collection,
  addDoc,
} from 'firebase/firestore';
import { db } from '@/firebase/config';

export const updateDriverStatus = async (
  driverId: string,
  status: 'Approved' | 'Rejected'
) => {
  const driverRef = doc(db, 'drivers', driverId);
  await updateDoc(driverRef, { status });
};

export const deleteMenuItem = async (itemId: string) => {
  await deleteDoc(doc(db, 'menuItems', itemId));
};

export const addMenuItem = async (item: any) => {
  await addDoc(collection(db, 'menuItems'), item);
};

export const deletePromotion = async (promoId: string) => {
  await deleteDoc(doc(db, 'promotions', promoId));
};

export const addPromotion = async (promo: any) => {
  await addDoc(collection(db, 'promotions'), promo);
};

export const hideReview = async (reviewId: string) => {
  await deleteDoc(doc(db, 'reviews', reviewId));
};

export const updateUserStatus = async (
  userId: string,
  status: 'Active' | 'Blocked'
) => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, { status });
};
