import { ScrollView, TouchableOpacity, View, Text } from 'react-native';
import { format, isSameDay } from 'date-fns';
import { memo } from 'react';

interface DateScrollProps {
  days: Array<{
    date: Date;
    dayName: string;
    dayNumber: string;
    isToday: boolean;
    isPast: boolean;
  }>;
  scrollRef: any;
}

export const DateScroll = memo(({ days, scrollRef }: DateScrollProps) => {
  return (
    <View className="h-24 mt-3">
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        className="px-0 py-2"
        contentContainerStyle={{
          paddingHorizontal: 10
        }}
      >
        {days.map((day) => (
          <TouchableOpacity
            key={day.date.toISOString()}
            className={`items-center mx-1.5 py-4 rounded-xl ${
              day.isToday
                ? 'bg-[#6C63FF]'
                : day.isPast
                ? 'bg-gray-50'
                : 'bg-white'
            }`}
            style={{
              shadowColor: day.isToday ? '#6C63FF' : '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: day.isToday ? 0.3 : 0.08,
              shadowRadius: day.isToday ? 8 : 4,
              elevation: day.isToday ? 8 : 2,
              transform: [{ scale: day.isToday ? 1.05 : 1 }],
              borderWidth: 1,
              borderColor: day.isToday
                ? 'rgba(108, 99, 255, 0.1)'
                : day.isPast
                ? 'rgba(0,0,0,0.02)'
                : 'rgba(0,0,0,0.03)',
              width: 60,
            }}
          >
            <Text
              className={`text-[13px] font-OpenSansSemiBold ${
                day.isToday
                  ? 'text-white'
                  : day.isPast
                  ? 'text-gray-400'
                  : 'text-gray-500'
              }`}
            >
              {day.dayName}
            </Text>
            <Text
              className={`text-[16px] font-OpenSansBold mt-0.5 ${
                day.isToday
                  ? 'text-white'
                  : day.isPast
                  ? 'text-gray-400'
                  : 'text-gray-800'
              }`}
            >
              {day.dayNumber}
            </Text>
            {day.isToday && (
              <View className="absolute -bottom-1 w-1 h-1 rounded-full bg-white" />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
});
