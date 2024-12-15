import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopBar from '@/components/ui/TopBar';
import DaysProgress from '@/components/ui/DaysProgress';
import HabitsList from '@/components/ui/HabitsList';
import { useEffect, useState, useCallback, memo } from 'react';
import { getUserHabitsByFrequency, getTodayProgress } from '@/firebase/habits';
import { Habit } from '@/types/habit';
import { useAuth } from '@/context/AuthContext';
import { useLocalSearchParams } from 'expo-router';

export default function Home() {
  const [habits, setHabits] = useState<Record<string, Habit[]>>({
    daily: [],
    weekly: [],
    monthly: []
  });
  const [todayProgress, setTodayProgress] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { refresh } = useLocalSearchParams();

  const fetchHabits = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const [dailyHabits, weeklyHabits, monthlyHabits] = await Promise.all([
        getUserHabitsByFrequency(user.uid, 'daily'),
        getUserHabitsByFrequency(user.uid, 'weekly'),
        getUserHabitsByFrequency(user.uid, 'monthly')
      ]);

      setHabits({
        daily: dailyHabits,
        weekly: weeklyHabits,
        monthly: monthlyHabits
      });

      const progress = await getTodayProgress(user.uid);
      setTodayProgress(progress);
    } catch (error) {
      console.error('Error fetching habits:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchHabits();
  }, [user]);

  useEffect(() => {
    if (refresh === 'true') {
      fetchHabits();
    }
  }, [refresh]);

  return (
    <SafeAreaView className="flex-1 bg-[#F5F7FA]">
      <TopBar />
      <DaysProgress />
      <HabitsList
        habits={habits}
        todayProgress={todayProgress}
        isLoading={loading}
        onRefresh={fetchHabits}
      />
    </SafeAreaView>
  );
}
