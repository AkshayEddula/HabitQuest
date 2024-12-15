import { View, Text, ScrollView, TouchableOpacity, Alert, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { updateHabitProgress } from '@/firebase/habits';
import { useState, memo } from 'react';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutLeft,
  Layout,
  BounceIn
} from 'react-native-reanimated';
import { Habit } from '@/types/habit';
import { useAuth } from '@/context/AuthContext';
import { db, PROGRESS_COLLECTION } from '@/firebase/config';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import LoadingSpinner from './LoadingSpinner';
import { ColorButton } from '@/components/ui/ColorButton';

type TabType = 'daily' | 'weekly' | 'monthly';

const TABS: { key: TabType; label: string }[] = [
  { key: 'daily', label: 'Today' },
  { key: 'weekly', label: 'Weekly' },
  { key: 'monthly', label: 'Monthly' },
];

interface HabitsListProps {
  habits: Record<string, Habit[]>;
  todayProgress: Record<string, number>;
  isLoading?: boolean;
  onRefresh?: () => void;
}

export default function HabitsList({ habits, todayProgress, isLoading, onRefresh }: HabitsListProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('daily');
  const [completedHabits, setCompletedHabits] = useState<Record<string, boolean>>({});

  const currentHabits = habits[activeTab] || [];

  const handleComplete = async (habitId: string, target: number) => {
    if (!user) return;

    try {
      const progressRef = doc(db, PROGRESS_COLLECTION);
      await setDoc(progressRef, {
        habitId,
        userId: user.uid,
        date: new Date().toISOString().split('T')[0],
        value: target,
        completed: true,
        timestamp: serverTimestamp()
      });

      setCompletedHabits(prev => ({
        ...prev,
        [habitId]: true
      }));

      if (onRefresh) {
        onRefresh(); // Refresh the habits list after completion
      }

      Alert.alert('Success! 🎉', 'Habit completed!');
    } catch (error) {
      console.error('Error updating progress:', error);
      Alert.alert('Error', 'Failed to update progress');
    }
  };

  const renderEmptyState = () => (
    <Animated.View
      entering={FadeIn}
      className="items-center justify-center py-8"
    >
      <Text className="text-gray-500 font-OpenSansMedium text-center">
        No habits for this period yet.{'\n'}
        Tap + to add a new habit!
      </Text>
    </Animated.View>
  );

  return (
    <View className="mt-6">
      <View className="flex-row items-center justify-between px-5 mb-4">
        <Text className="text-[22px] font-OpenSansBold text-gray-800">
          Your Habits
        </Text>
        <TouchableOpacity
          className="bg-[#6C63FF] p-2 rounded-full"
          onPress={() => {/* Navigate to add habit */}}
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View className="flex-row px-4 mb-4">
        {TABS.map(tab => (
          <Pressable
            key={tab.key}
            onPress={() => setActiveTab(tab.key)}
            className={`mr-3 px-4 py-2 rounded-full ${
              activeTab === tab.key
                ? 'bg-[#6C63FF]'
                : 'bg-white border border-gray-100'
            }`}
          >
            <Text
              className={`font-OpenSansSemiBold ${
                activeTab === tab.key
                  ? 'text-white'
                  : 'text-gray-600'
              }`}
            >
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView
        className="px-4"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          layout={Layout}
          entering={SlideInRight}
          exiting={SlideOutLeft}
        >
          {isLoading ? (
            <LoadingSpinner />
          ) : currentHabits.length === 0 ? (
            renderEmptyState()
          ) : (
            currentHabits.map(habit => (
              <Animated.View
                key={habit.id}
                entering={FadeIn.delay(200)}
                exiting={FadeOut}
                layout={Layout}
              >
                <TouchableOpacity
                  className="bg-white rounded-2xl p-4 mb-3 flex-row items-center"
                  style={{
                    shadowColor: habit.color,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    elevation: 3,
                    opacity: completedHabits[habit.id] ? 0.7 : 1,
                  }}
                >
                  <Animated.View
                    entering={BounceIn}
                    className="w-12 h-12 rounded-full items-center justify-center"
                    style={{ backgroundColor: `${habit.color}20` }}
                  >
                    <Ionicons
                      name={habit.icon as any}
                      size={24}
                      color={habit.color}
                    />
                  </Animated.View>
                  <View className="flex-1 ml-3">
                    <Text className="text-[16px] font-OpenSansBold text-gray-800">
                      {habit.title}
                    </Text>
                    <Text className="text-[14px] font-OpenSans text-gray-500">
                      Target: {habit.target} {habit.unit}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleComplete(habit.id, habit.target)}
                    disabled={completedHabits[habit.id]}
                  >
                    <View
                      className="w-8 h-8 rounded-full items-center justify-center"
                      style={{
                        backgroundColor: completedHabits[habit.id]
                          ? '#22C55E'
                          : `${habit.color}10`
                      }}
                    >
                      <Ionicons
                        name={completedHabits[habit.id] ? "checkmark" : "checkmark-outline"}
                        size={20}
                        color={completedHabits[habit.id] ? "white" : habit.color}
                      />
                    </View>
                  </TouchableOpacity>
                </TouchableOpacity>
              </Animated.View>
            ))
          )}
        </Animated.View>
      </ScrollView>
    </View>
  );
}
