import { View, Text, ScrollView, Dimensions, Animated } from 'react-native';
import { memo, useMemo, useEffect, useRef } from 'react';
import Svg, { Circle } from 'react-native-svg';
import { format, eachDayOfInterval, addDays } from 'date-fns';

const { width } = Dimensions.get('window');

type DayProgressProps = {
  day: string;
  date: number;
  fullDate: Date;
  progress: number;
  isToday: boolean;
}

// More realistic progress data
const PROGRESS_DATA: Record<string, number> = {
  [format(new Date(), 'yyyy-MM-dd')]: 45, // Today
  [format(addDays(new Date(), 1), 'yyyy-MM-dd')]: 0, // Tomorrow
  [format(addDays(new Date(), 2), 'yyyy-MM-dd')]: 0, // Day after tomorrow
  [format(addDays(new Date(), -1), 'yyyy-MM-dd')]: 80,
  [format(addDays(new Date(), -2), 'yyyy-MM-dd')]: 100,
  [format(addDays(new Date(), -3), 'yyyy-MM-dd')]: 65,
  [format(addDays(new Date(), -4), 'yyyy-MM-dd')]: 90,
  [format(addDays(new Date(), -5), 'yyyy-MM-dd')]: 75,
};

const DayProgress = memo(({ day, date, progress, isToday, index }: DayProgressProps & { index: number }) => {
  const size = 52;
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  // Animation values for entry only
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const delay = index * 100;

    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
        delay,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
        delay,
      })
    ]).start();
  }, []);

  // Get background color based on progress and isToday
  const getBgColor = () => {
    if (isToday) return '#F0F0FF';
    if (progress === 100) return '#F0FFF4';
    if (progress > 0) return '#F8FAFC';
    return '#FAFAFA';
  };

  return (
    <Animated.View
      className={`items-center mx-1 py-3 px-1 ${isToday ? 'opacity-100' : 'opacity-85'}`}
      style={{
        backgroundColor: getBgColor(),
        borderRadius: 16,
        minWidth: 70,
        borderWidth: 1,
        borderColor: isToday ? 'rgba(108, 99, 255, 0.1)' : 'rgba(0,0,0,0.03)',
        transform: [{ scale: scaleAnim }],
        opacity: opacityAnim,
      }}
    >
      <Text
        className={`text-[15px] mb-2.5 ${
          isToday
            ? 'font-OpenSansBold text-[#6C63FF]'
            : progress === 100
              ? 'font-OpenSansBold text-[#22C55E]'
              : 'font-OpenSansSemiBold text-gray-500'
        }`}
      >
        {day}
      </Text>
      <View
        className="relative"
        style={{
          shadowColor: isToday ? '#6C63FF' : progress === 100 ? '#22C55E' : '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: isToday ? 0.2 : 0.1,
          shadowRadius: 8,
          elevation: isToday ? 4 : 2,
        }}
      >
        <Svg height={size} width={size}>
          {/* Inner Shadow Circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="white"
            stroke={
              isToday
                ? "#E8EBFF"
                : progress === 100
                  ? "#E8FFE8"
                  : "#F1F5F9"
            }
            strokeWidth={6}
          />
          {/* Background Circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={
              isToday
                ? "#EEF2FF"
                : progress === 100
                  ? "#F0FFF4"
                  : "#F1F5F9"
            }
            strokeWidth={strokeWidth}
            fill="white"
          />
          {/* Progress Circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={progress === 100 ? "#22C55E" : "#6C63FF"}
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="none"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>
        <View className="absolute inset-0 items-center justify-center">
          <Text
            className={`text-[17px] ${
              isToday
                ? 'font-OpenSansBold text-[#6C63FF]'
                : progress === 100
                  ? 'font-OpenSansBold text-[#22C55E]'
                  : 'font-OpenSansSemiBold text-gray-700'
            }`}
          >
            {date}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
});

export default function DaysProgress() {
  const scrollViewRef = useRef<ScrollView>(null);
  const headerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(headerAnim, {
      toValue: 1,
      tension: 40,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, []);

  const days = useMemo(() => {
    const today = new Date();
    const nextTwoWeeks = addDays(today, 14); // Show next 14 days including today

    return eachDayOfInterval({
      start: today,
      end: nextTwoWeeks
    }).map(date => {
      const dateStr = format(date, 'yyyy-MM-dd');
      return {
        fullDate: date,
        day: format(date, 'EEE'),
        date: parseInt(format(date, 'd')),
        progress: PROGRESS_DATA[dateStr] ?? 0, // Get progress from data or default to 0
        isToday: format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
      };
    });
  }, []);

  return (
    <View className="mt-4">
      <Animated.View
        className="flex-row items-center justify-between px-5 mb-4"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 3,
          transform: [
            { translateY: headerAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0],
            })},
          ],
          opacity: headerAnim,
        }}
      >
        <Text className="text-[22px] font-OpenSansBold text-gray-800">
          Daily Progress
        </Text>
        <Text className="text-[14px] font-OpenSansSemiBold text-[#6C63FF]">
          {format(new Date(), 'MMMM yyyy')}
        </Text>
      </Animated.View>
      <Animated.View
        className="bg-white py-1 rounded-3xl mx-4"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 3,
          borderWidth: 1,
          borderColor: 'rgba(0,0,0,0.03)',
          transform: [
            { scale: headerAnim },
          ],
        }}
      >
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 1,
            paddingVertical: 4,
          }}
          snapToInterval={74}
          decelerationRate="fast"
        >
          {days.map((day, index) => (
            <DayProgress
              key={format(day.fullDate, 'yyyy-MM-dd')}
              {...day}
              index={index}
            />
          ))}
        </ScrollView>
      </Animated.View>
    </View>
  );
}
