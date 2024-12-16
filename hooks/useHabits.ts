import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getUserHabitsByFrequency, getTodayProgress } from '@/firebase/habits';
import { Habit } from '@/types/habit';

export function useHabits(frequency: 'daily' | 'weekly' | 'monthly' = 'daily') {
  const { user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchHabits = async () => {
      try {
        const habits = await getUserHabitsByFrequency(user.uid, frequency);
        const todayProgress = await getTodayProgress(user.uid);
        setHabits(habits);
        setProgress(todayProgress);
      } catch (error) {
        console.error('Error fetching habits:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHabits();
  }, [user, frequency]);

  return { habits, progress, loading };
}
