import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useHabits } from '@/hooks/useHabits';
import { HabitCard } from '@/components/ui/HabitCard';
import { DateScroll } from '@/components/ui/DateScroll';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { format, eachDayOfInterval, startOfMonth, endOfMonth, isSameDay } from 'date-fns';

interface TodayViewProps {
  scrollRef: any;
}

function TodayView({ scrollRef }: TodayViewProps) {
  const { habits, progress, loading } = useHabits('daily');

  const monthDays = useMemo(() => {
    const today = new Date();
    const monthStart = startOfMonth(today);
    const monthEnd = endOfMonth(today);

    const allDays = eachDayOfInterval({
      start: monthStart,
      end: monthEnd
    }).map(date => ({
      date,
      dayName: format(date, 'EEE'),
      dayNumber: format(date, 'd'),
      isToday: isSameDay(date, today),
      isPast: date < today && !isSameDay(date, today)
    }));

    const todayData = allDays.find(day => day.isToday)!;
    const pastDays = allDays
      .filter(day => day.isPast)
      .sort((a, b) => parseInt(a.dayNumber) - parseInt(b.dayNumber));
    const futureDays = allDays
      .filter(day => !day.isPast && !day.isToday)
      .sort((a, b) => parseInt(a.dayNumber) - parseInt(b.dayNumber));

    return [...pastDays, todayData, ...futureDays];
  }, []);

  const content = useMemo(() => (
    <ScrollView
      showsVerticalScrollIndicator={false}
      className="flex-1 mt-1 mb-16"
      contentContainerStyle={{
        paddingBottom: 20
      }}
    >
      <View className="px-4 pt-2">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-[20px] font-OpenSansBold text-gray-800">
            Today's Habits
          </Text>
          <TouchableOpacity
            className="flex-row items-center bg-[#6C63FF] px-4 py-2 rounded-xl"
            style={{
              shadowColor: '#6C63FF',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <Text className="text-[14px] font-OpenSansSemiBold text-white mr-2">
              Show All
            </Text>
            <Ionicons name="arrow-forward" size={18} color="white" />
          </TouchableOpacity>
        </View>

        <View className="flex-row flex-wrap justify-between">
          {habits.map(habit => (
            <View key={habit.id} className="w-[48%] mb-4">
              <HabitCard
                title={habit.title}
                icon={habit.icon}
                progress={progress[habit.id] || 0}
              />
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  ), [habits, progress]);

  if (loading) {
    return (
      <View className="flex-1">
        <DateScroll days={monthDays} scrollRef={scrollRef} />
        <View className="flex-1 justify-center">
          <LoadingSpinner />
        </View>
      </View>
    );
  }

  return (
    <Animated.View
      entering={FadeInDown.delay(200)}
      className="flex-1"
    >
      <DateScroll days={monthDays} scrollRef={scrollRef} />
      {content}
    </Animated.View>
  );
}

export default TodayView;
