import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState, useMemo, useRef } from 'react';
import { format, eachDayOfInterval, startOfMonth, endOfMonth, isSameDay } from 'date-fns';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { HabitCard } from '@/components/ui/HabitCard';
import { DateScroll } from '@/components/ui/DateScroll';
import { useHabits } from '@/hooks/useHabits';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import TodayView from '@/components/analytics/TodayView';
import WeeklyView from '@/components/analytics/WeeklyView';
import OverallView from '@/components/analytics/OverallView';

type TabType = 'today' | 'weekly' | 'overall';

const TABS: { key: TabType; label: string }[] = [
  { key: 'today', label: 'Today' },
  { key: 'weekly', label: 'Weekly' },
  { key: 'overall', label: 'Overall' }
];

export default function Analytics() {
  const [activeTab, setActiveTab] = useState<TabType>('today');
  const scrollViewRef = useRef<ScrollView>(null);

  return (
    <SafeAreaView className="flex-1 bg-[#F5F7FA]">
      {/* Header */}
      <View className="px-4 py-3">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-white items-center justify-center shadow-sm"
          >
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text className="text-[24px] font-OpenSansMedium text-gray-800">
            Analytics
          </Text>
          <View className="w-10" />
        </View>
      </View>

      {/* Tabs */}
      <View className="flex-row justify-between px-4 mt-4">
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab.key}
            onPress={() => setActiveTab(tab.key)}
            className={`mr-3 px-8 py-3 rounded-xl ${
              activeTab === tab.key
                ? 'bg-[#6C63FF]'
                : 'bg-white border border-gray-100'
            }`}
          >
            <Text
              className={`font-OpenSansSemiBold ${
                activeTab === tab.key ? 'text-white' : 'text-gray-600'
              }`}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content based on active tab */}
      <View className="flex-1">
        {activeTab === 'today' && <TodayView scrollRef={scrollViewRef} />}
        {activeTab === 'weekly' && <WeeklyView />}
        {activeTab === 'overall' && <OverallView />}
      </View>
    </SafeAreaView>
  );
}
