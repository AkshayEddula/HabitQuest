import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useHabits } from '@/hooks/useHabits';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const DAYS = [
  { label: ['S', 'u'], value: 'Su' },
  { label: ['M'], value: 'M' },
  { label: ['T', 'u'], value: 'Tu' },
  { label: ['W'], value: 'W' },
  { label: ['T', 'h'], value: 'Th' },
  { label: ['F'], value: 'F' },
  { label: ['S', 'a'], value: 'Sa' }
];
const TASK_SCALE = [20, 15, 10, 5, 1];
const DAILY_TASKS = [8, 12, 15, 7, 18, 13, 10]; // Example data

const QUESTS = [
  {
    id: '1',
    icon: 'fitness',
    title: 'Morning Run',
    frequency: 'Everyday',
    metric: '25min/day',
    completedDays: ['Mon', 'Tue', 'Thu', 'Sat'] // Example completed days
  },
  {
    id: '2',
    icon: 'book',
    title: 'Reading',
    frequency: 'Week/4',
    metric: '2 chapters/day',
    completedDays: ['Sun', 'Wed', 'Fri']
  },
  {
    id: '3',
    icon: 'water',
    title: 'Hydration',
    frequency: 'Monthly',
    metric: '8 glasses/day',
    completedDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
  }
];

function QuestItem({ quest }: { quest: typeof QUESTS[0] }) {
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <View className="bg-white rounded-2xl p-4 mb-3">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <View
            className="w-10 h-10 rounded-full items-center justify-center"
            style={{ backgroundColor: '#A783F820' }}
          >
            <Ionicons name={quest.icon as any} size={20} color="#A783F8" />
          </View>
          <View className="ml-3">
            <Text className="text-[16px] font-OpenSansBold text-gray-800">
              {quest.title}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center">
          <Text className="text-[12px] font-OpenSansSemiBold text-gray-500 mr-3">
            {quest.frequency}
          </Text>
          <TouchableOpacity>
            <Ionicons name="ellipsis-vertical" size={20} color="#94A3B8" />
          </TouchableOpacity>
        </View>
      </View>

      <View className="mt-4">
        <View className="flex-row justify-between">
          {weekDays.map((day) => {
            const isCompleted = quest.completedDays.includes(day);
            return (
              <View key={day} className="items-center">
                <View
                  className={`w-11 h-11 rounded-full items-center justify-center mb-1 ${
                    isCompleted ? 'bg-[#A783F8]' : 'bg-gray-100'
                  }`}
                >
                  {isCompleted && (
                    <Ionicons name="checkmark" size={20} color="white" />
                  )}
                </View>
                <Text
                  className={`text-[11px] font-OpenSansSemiBold ${
                    isCompleted ? 'text-[#A783F8]' : 'text-gray-400'
                  }`}
                >
                  {day[0]}
                </Text>
              </View>
            );
          })}
        </View>

        <View className="flex-row justify-end mt-3">
          <Text className="text-[12px] font-OpenSansSemiBold text-gray-500">
            {quest.metric}
          </Text>
        </View>
      </View>
    </View>
  );
}

function QuestsList() {
  return (
    <View className="mt-6">
      <Text className="text-[16px] font-OpenSansBold text-gray-800 mb-4">
        Quests
      </Text>
      {QUESTS.map(quest => (
        <QuestItem key={quest.id} quest={quest} />
      ))}
    </View>
  );
}

function WeeklyTasksChart() {
  const maxTasks = 20;

  return (
    <LinearGradient
      colors={['#A783F8', '#7F45FF']}
      start={{ x: 1, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{
        borderRadius: 24,
      }}
      className="p-6"
    >
      <Text className="text-[14px] font-OpenSansBold text-white mb-6">
        Completed in Last 7 Days
      </Text>

      <View className="flex-row h-[180px]">
        {/* Task Scale */}
        <View className="pr-6 items-center justify-between pb-8">
          {TASK_SCALE.map((scale) => (
            <Text
              key={scale}
              className="text-[12px] font-OpenSansBold text-white"
            >
              {scale}
            </Text>
          ))}
        </View>

        {/* Chart Bars */}
        <View className="flex-1">
          <View className="flex-1 flex-row justify-between items-end">
            {DAILY_TASKS.map((tasks, index) => (
              <View key={index} className="items-center">
                <View className="w-3.5 h-full bg-white/20 rounded-lg overflow-hidden">
                  <View
                    className="bg-[#FED766] rounded-lg w-full absolute bottom-0"
                    style={{
                      height: `${(tasks / maxTasks) * 100}%`,
                    }}
                  />
                </View>
              </View>
            ))}
          </View>

          {/* Days Labels */}
          <View className="flex-row justify-between mt-3">
            {DAYS.map((day) => (
              <View key={day.value} className="items-center w-4">
                <View className="flex-row">
                  {day.label.map((letter, i) => (
                    <Text
                      key={i}
                      className="text-[12px] font-OpenSansBold text-white"
                      style={{ letterSpacing: 0 }}
                    >
                      {letter}
                    </Text>
                  ))}
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

export default function WeeklyView() {
  const { habits, progress, loading } = useHabits('weekly');
  const weeklyProgress = 68;
  const increasedBy = 4;

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Animated.View
      entering={FadeInDown.delay(200)}
      className="flex-1"
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1 mb-16"
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 20
        }}
      >
        {/* Weekly Progress Card */}
        <LinearGradient
          colors={['#A783F8', '#7F45FF']}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{
            borderRadius: 24,
          }}
          className="p-6 my-6"
        >
          <Text className="text-[14px] font-OpenSansSemiBold text-white/90 mb-1">
            Weekly Progress
          </Text>

          <View>
            <View className="flex-row items-center">
              <Text className="text-[32px] font-OpenSansBold text-white mr-4">
                {weeklyProgress}%
              </Text>
              <View className="flex-1 h-3 bg-white/20 rounded-full overflow-hidden">
                <View
                  className="h-full bg-[#FED766] rounded-full"
                  style={{ width: `${weeklyProgress}%` }}
                />
              </View>
            </View>

            <View className="flex-row justify-end">
              <Text className="text-[12px] font-OpenSansSemiBold text-white">
                Increased by {increasedBy}% to last week
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* Weekly Tasks Chart */}
        <WeeklyTasksChart />

        {/* Quests List */}
        <QuestsList />
      </ScrollView>
    </Animated.View>
  );
}
