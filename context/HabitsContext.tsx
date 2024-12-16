import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { getUserHabitsByFrequency, getTodayProgress } from '@/firebase/habits';
import { Habit } from '@/types/habit';

interface HabitsContextType {
  habits: {
    daily: Habit[];
    weekly: Habit[];
    monthly: Habit[];
  };
  progress: Record<string, number>;
  loading: boolean;
  refreshHabits: () => Promise<void>;
}

const HabitsContext = createContext<HabitsContextType | null>(null);

export function HabitsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [habits, setHabits] = useState<HabitsContextType['habits']>({
    daily: [],
    weekly: [],
    monthly: []
  });
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  const fetchHabits = async () => {
    if (!user) return;
    try {
      const [dailyHabits, weeklyHabits, monthlyHabits, todayProgress] = await Promise.all([
        getUserHabitsByFrequency(user.uid, 'daily'),
        getUserHabitsByFrequency(user.uid, 'weekly'),
        getUserHabitsByFrequency(user.uid, 'monthly'),
        getTodayProgress(user.uid)
      ]);

      setHabits({
        daily: dailyHabits,
        weekly: weeklyHabits,
        monthly: monthlyHabits
      });
      setProgress(todayProgress);
    } catch (error) {
      console.error('Error fetching habits:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, [user]);

  return (
    <HabitsContext.Provider value={{ habits, progress, loading, refreshHabits: fetchHabits }}>
      {children}
    </HabitsContext.Provider>
  );
}

export function useHabits(frequency?: 'daily' | 'weekly' | 'monthly') {
  const context = useContext(HabitsContext);
  if (!context) throw new Error('useHabits must be used within HabitsProvider');

  if (frequency) {
    return {
      habits: context.habits[frequency],
      progress: context.progress,
      loading: context.loading,
      refreshHabits: context.refreshHabits
    };
  }

  return context;
}
