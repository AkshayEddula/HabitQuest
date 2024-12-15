import { View, Text, ScrollView, TextInput, TouchableOpacity, Dimensions, KeyboardAvoidingView, Platform, Switch, Keyboard, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useMemo, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { addHabit } from '@/firebase/habits';
import { HabitFrequency, HabitMetric, HabitUnit } from '@/types/habit';
import Animated, { FadeInDown, FadeInUp, Layout } from 'react-native-reanimated';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from '@/context/AuthContext';
import { ColorButton } from '@/components/ui/ColorButton';

const { width } = Dimensions.get('window');

const COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96C93D', '#FED766',
  '#6C63FF', '#FF9F43', '#E056FD', '#20BF6B', '#A55EEA'
];

const ICONS = [
  { name: 'fitness', label: 'Fitness' },
  { name: 'book', label: 'Reading' },
  { name: 'water', label: 'Hydration' },
  { name: 'bicycle', label: 'Cycling' },
  { name: 'bed', label: 'Sleep' },
  { name: 'walk', label: 'Walking' },
  { name: 'medkit', label: 'Health' },
  { name: 'musical-notes', label: 'Music' },
  { name: 'school', label: 'Study' },
  { name: 'cafe', label: 'Nutrition' }
];

const FREQUENCIES = [
  { key: 'daily', label: 'Daily' },
  { key: 'weekly', label: 'Weekly' },
  { key: 'monthly', label: 'Monthly' },
] as const;

const METRICS = [
  { key: 'count', label: 'Count', icon: 'repeat', description: 'Track by number of times' },
  { key: 'duration', label: 'Duration', icon: 'time', description: 'Track by time spent' },
  { key: 'distance', label: 'Distance', icon: 'map', description: 'Track by distance covered' },
] as const;

function SectionTitle({ title }: { title: string }) {
  return (
    <Text className="text-[16px] font-OpenSansBold text-gray-800 mb-3">
      {title}
    </Text>
  );
}

function getUnitForMetric(metricType: HabitMetric): string {
  switch (metricType) {
    case 'count':
      return 'times';
    case 'duration':
      return 'minutes';
    case 'distance':
      return 'km';
    default:
      return 'times';
  }
}

export default function AddHabit() {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [selectedIcon, setSelectedIcon] = useState(ICONS[0].name);
  const [metric, setMetric] = useState<HabitMetric>('count');
  const [target, setTarget] = useState('1');
  const [frequency, setFrequency] = useState<HabitFrequency>('daily');
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [time, setTime] = useState('');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [reminder, setReminder] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!user || !title || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await addHabit({
        userId: user.uid,
        title,
        description,
        icon: selectedIcon,
        color: selectedColor,
        metric,
        unit: getUnitForMetric(metric),
        target: parseInt(target),
        frequency,
        schedule: {
          days: selectedDays,
          time,
          reminder
        },
        archived: false
      });

      router.push({
        pathname: '/(tabs)',
        params: { refresh: 'true' }
      });
    } catch (error) {
      console.error('Error adding habit:', error);
      Alert.alert('Error', 'Failed to create habit');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleColorSelect = useCallback((color: string) => {
    setSelectedColor(color);
  }, []);

  const handleIconSelect = useCallback((icon: string) => {
    setSelectedIcon(icon);
  }, []);

  const handleMetricChange = useCallback((newMetric: HabitMetric) => {
    setMetric(newMetric);
  }, []);

  const isFormValid = useMemo(() =>
    title.trim() &&
    target &&
    parseInt(target) > 0 &&
    (frequency !== 'daily' || selectedDays.length > 0)
  , [title, target, frequency, selectedDays]);

  const memoizedColors = useMemo(() =>
    COLORS.map(color => (
      <ColorButton
        key={color}
        color={color}
        isSelected={selectedColor === color}
        onSelect={() => handleColorSelect(color)}
      />
    ))
  , [selectedColor, handleColorSelect]);

  return (
    <SafeAreaView className="flex-1 bg-[#F5F7FA]">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        style={{ zIndex: 1 }}
      >
        {/* Header */}
        <View className="px-4 py-3 bg-[#F5F7FA]">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-white items-center justify-center shadow-lg"
            style={{
              shadowColor: '#6C63FF',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Animated.Text
            entering={FadeInDown.delay(200)}
            className="text-[28px] font-OpenSansBold text-gray-800 mt-4"
          >
            Create New Habit
          </Animated.Text>
        </View>

        <View className="flex-1" style={{ zIndex: 2 }}>
          <ScrollView
            className="flex-1 px-4"
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            onScrollBeginDrag={Keyboard.dismiss}
            contentContainerStyle={{
              paddingVertical: 16,
              gap: 15,
              paddingBottom: Platform.OS === 'ios' ? 140 : 120,
            }}
          >
            <Animated.View
              entering={FadeInUp.delay(300)}
              style={{ gap: 15 }}
            >
              {/* Basic Info */}
              <View className="bg-white rounded-2xl p-4 shadow-sm">
                <SectionTitle title="Add Your Habit Details" />
                <TextInput
                  className="text-[16px] font-OpenSansSemiBold text-gray-800 p-4 bg-gray-50 rounded-xl mb-3"
                  placeholder="Habit Title"
                  value={title}
                  onChangeText={setTitle}
                  placeholderTextColor="#94A3B8"
                />
                <TextInput
                  className="text-[14px] font-OpenSans text-gray-600 p-4 bg-gray-50 rounded-xl"
                  placeholder="Description (optional)"
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={3}
                  placeholderTextColor="#94A3B8"
                />
              </View>

              {/* Icon & Color Selection */}
              <View className="bg-white rounded-2xl p-4 shadow-sm">
                <SectionTitle title="Choose Icon & Color" />
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className="mb-4"
                >
                  {memoizedColors}
                </ScrollView>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                >
                  {ICONS.map(icon => (
                    <TouchableOpacity
                      key={icon.name}
                      onPress={() => handleIconSelect(icon.name)}
                      style={{
                        backgroundColor: selectedIcon === icon.name
                          ? selectedColor + '20'
                          : '#F1F5F9'
                      }}
                      className="w-16 h-16 rounded-2xl mr-3 items-center justify-center"
                    >
                      <Ionicons
                        name={icon.name as any}
                        size={28}
                        color={selectedIcon === icon.name ? selectedColor : '#64748B'}
                      />
                      <Text className="text-[10px] font-OpenSans mt-1 text-gray-600">
                        {icon.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Metric Selection with Target */}
              <View className="bg-white rounded-2xl p-4 shadow-sm">
                <SectionTitle title="Choose Metric & Target" />
                <View className="space-y-4">
                  <View className="space-y-3">
                    {METRICS.map(metricOption => (
                      <TouchableOpacity
                        key={metricOption.key}
                        onPress={() => handleMetricChange(metricOption.key)}
                        className={`p-4 rounded-xl border ${
                          metric === metricOption.key
                            ? 'border-[#6C63FF] bg-[#6C63FF10]'
                            : 'border-gray-100 bg-gray-50'
                        }`}
                      >
                        <View className="flex-row items-center">
                          <View
                            className={`w-10 h-10 rounded-full items-center justify-center ${
                              metric === metricOption.key
                                ? 'bg-[#6C63FF]'
                                : 'bg-gray-200'
                            }`}
                          >
                            <Ionicons
                              name={metricOption.icon}
                              size={20}
                              color={metric === metricOption.key ? 'white' : '#64748B'}
                            />
                          </View>
                          <View className="ml-3 flex-1">
                            <Text
                              className={`font-OpenSansBold ${
                                metric === metricOption.key
                                  ? 'text-[#6C63FF]'
                                  : 'text-gray-700'
                              }`}
                            >
                              {metricOption.label}
                            </Text>
                            <Text className="text-xs text-gray-500 mt-1">
                              {metricOption.description}
                            </Text>
                          </View>
                          <View
                            className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                              metric === metricOption.key
                                ? 'border-[#6C63FF] bg-[#6C63FF]'
                                : 'border-gray-300'
                            }`}
                          >
                            {metric === metricOption.key && (
                              <Ionicons name="checkmark" size={14} color="white" />
                            )}
                          </View>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <View className="mt-4">
                    <Text className="text-sm text-gray-500 mb-2 font-OpenSans">
                      Target ({getUnitForMetric(metric)})
                    </Text>
                    <TextInput
                      className="text-[16px] font-OpenSansSemiBold text-gray-800 p-4 bg-gray-50 rounded-xl"
                      placeholder={`Target in ${getUnitForMetric(metric)}`}
                      value={target}
                      onChangeText={setTarget}
                      keyboardType="numeric"
                      placeholderTextColor="#94A3B8"
                    />
                  </View>
                </View>
              </View>

              {/* Frequency Selection */}
              <View className="bg-white rounded-2xl p-4 shadow-sm">
                <SectionTitle title="Frequency" />
                <View className="flex-row flex-wrap gap-2">
                  {FREQUENCIES.map(freq => (
                    <TouchableOpacity
                      key={freq.key}
                      onPress={() => setFrequency(freq.key)}
                      className={`px-4 py-2 rounded-xl ${
                        frequency === freq.key
                          ? 'bg-[#6C63FF]'
                          : 'bg-gray-50'
                      }`}
                    >
                      <Text
                        className={`font-OpenSansSemiBold ${
                          frequency === freq.key
                            ? 'text-white'
                            : 'text-gray-600'
                        }`}
                      >
                        {freq.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Reminder Section */}
              <View className="bg-white rounded-2xl p-4 shadow-sm">
                <SectionTitle title="Reminder Settings" />
                <View className="flex-row items-center justify-between mb-4">
                  <View>
                    <Text className="text-[16px] font-OpenSansSemiBold text-gray-800">
                      Daily Reminder
                    </Text>
                    <Text className="text-[14px] font-OpenSans text-gray-500 mt-1">
                      Get notified at your preferred time
                    </Text>
                  </View>
                  <Switch
                    value={reminder}
                    onValueChange={setReminder}
                    trackColor={{ false: '#E2E8F0', true: '#6C63FF50' }}
                    thumbColor={reminder ? '#6C63FF' : '#94A3B8'}
                    ios_backgroundColor="#E2E8F0"
                  />
                </View>

                {reminder && (
                  <TouchableOpacity
                    onPress={() => setShowTimePicker(true)}
                    className="bg-gray-50 p-4 rounded-xl"
                    style={{
                      shadowColor: '#6C63FF',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.05,
                      shadowRadius: 4,
                      elevation: 2,
                    }}
                  >
                    <Text className="text-[14px] font-OpenSansSemiBold text-gray-600">
                      Reminder Time: {time || 'Set time'}
                    </Text>
                  </TouchableOpacity>
                )}

                {showTimePicker && (
                  <DateTimePicker
                    value={time ? new Date(`2000-01-01T${time}`) : new Date()}
                    mode="time"
                    is24Hour={false}
                    display="spinner"
                    onChange={(event, selectedTime) => {
                      setShowTimePicker(false);
                      if (selectedTime) {
                        setTime(selectedTime.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true
                        }));
                      }
                    }}
                  />
                )}
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                onPress={handleSubmit}
                disabled={!isFormValid || isSubmitting}
                className={`bg-[#6C63FF] py-4 rounded-xl ${
                  (!isFormValid || isSubmitting) ? 'opacity-50' : ''
                }`}
                style={{
                  shadowColor: '#6C63FF',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  zIndex: 1000,
                  position: 'relative',
                }}
              >
                <View
                  className="absolute inset-0 rounded-xl"
                  style={{
                    backgroundColor: 'rgba(0,0,0,0.1)',
                    borderTopWidth: 1,
                    borderColor: 'rgba(255,255,255,0.2)',
                  }}
                />
                {isSubmitting ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white text-center font-OpenSansBold text-[16px]">
                    Create Habit
                  </Text>
                )}
              </TouchableOpacity>
            </Animated.View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
