import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle } from 'react-native-svg';
import { memo } from 'react';

interface HabitCardProps {
  title: string;
  icon: string;
  progress: number;
}

export const HabitCard = memo(({ title, icon, progress }: HabitCardProps) => {
  return (
    <LinearGradient
      colors={['#BFA6FF', '#9B75FF']}
      start={{ x: 1, y: 0 }}
      end={{ x: 0, y: 1 }}
      className="h-[230px] rounded-3xl p-4 relative overflow-hidden"
      style={{
        shadowColor: '#9B75FF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
      }}
    >
      <TouchableOpacity className="absolute top-4 right-4 z-10">
        <Ionicons name="ellipsis-horizontal" size={24} color="white" />
      </TouchableOpacity>

      <View className="items-center justify-center mt-8">
        <View className="relative">
          <View
            className="w-28 h-28 rounded-full items-center justify-center"
            style={{
              borderWidth: 6,
              borderColor: 'rgba(255, 255, 255, 0.2)',
            }}
          >
            <View
              style={{
                position: 'absolute',
                width: 112,
                height: 112,
                transform: [{ rotate: '-90deg' }]
              }}
            >
              <Svg width="112" height="112" viewBox="0 0 112 112">
                <Circle
                  cx="56"
                  cy="56"
                  r="53"
                  stroke="#FED766"
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 53 * progress / 100} ${2 * Math.PI * 53}`}
                />
              </Svg>
            </View>

            <View
              className="w-20 h-20 rounded-full items-center justify-center"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                borderWidth: 2,
                borderColor: 'rgba(255, 255, 255, 0.2)',
              }}
            >
              <Ionicons name={icon as any} size={32} color="white" />
            </View>
          </View>
        </View>

        <Text className="text-[18px] font-OpenSansBold text-white mt-6 text-center">
          {title}
        </Text>
        <Text className="text-[14px] font-OpenSansSemiBold text-white/80 mt-2">
          {progress}% Completed
        </Text>
      </View>
    </LinearGradient>
  );
});
