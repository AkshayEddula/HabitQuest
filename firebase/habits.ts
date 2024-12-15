import { db, HABITS_COLLECTION, PROGRESS_COLLECTION } from './config';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  orderBy
} from 'firebase/firestore';
import { Habit, HabitProgress } from '../types/habit';

// Fetch user's habits by frequency
export async function getUserHabitsByFrequency(userId: string, frequency?: 'daily' | 'weekly' | 'monthly') {
  try {
    let q = query(
      collection(db, HABITS_COLLECTION),
      where('userId', '==', userId),
      where('archived', '==', false),
      orderBy('createdAt', 'desc')
    );

    if (frequency) {
      q = query(q, where('frequency', '==', frequency));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Habit[];
  } catch (error) {
    console.error('Error fetching habits:', error);
    throw error;
  }
}

// Add new habit with proper typing
export async function addHabit(habitData: Omit<Habit, 'id' | 'createdAt'>) {
  try {
    const docRef = await addDoc(collection(db, HABITS_COLLECTION), {
      ...habitData,
      createdAt: serverTimestamp(),
      archived: false
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding habit:', error);
    throw error;
  }
}

// Get today's progress for all habits
export async function getTodayProgress(userId: string) {
  const today = new Date().toISOString().split('T')[0];
  try {
    const q = query(
      collection(db, PROGRESS_COLLECTION),
      where('userId', '==', userId),
      where('date', '==', today)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.reduce((acc, doc) => {
      const data = doc.data();
      return {
        ...acc,
        [data.habitId]: data.value
      };
    }, {});
  } catch (error) {
    console.error('Error fetching today progress:', error);
    throw error;
  }
}
