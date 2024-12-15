import { View, Text, Image, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { images } from '@/constants';
import { useEffect, useRef } from 'react';

function LevelProgressBar({ progress = 0.5 }) {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const width = 130;

  useEffect(() => {
    Animated.spring(progressAnim, {
      toValue: progress,
      useNativeDriver: true,
      friction: 8,
      tension: 40
    }).start();
  }, [progress]);

  return (
    <View className="relative">
      {/* Background Bar */}
      <View className="w-[140px] h-[8px] bg-[#E2E8F0] rounded-full overflow-hidden">
        {/* Progress Fill */}
        <View
          className="absolute h-full bg-[#FF4444]"
          style={{
            width: `${progress * 100}%`,
            backgroundColor: '#6C63FF',
          }}
        />
      </View>

      {/* Animated Ball */}
      <Animated.View
        style={{
          position: 'absolute',
          top: -13,
          transform: [
            {
              translateX: progressAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, width - 32]
              })
            },
            {
              scale: progressAnim.interpolate({
                inputRange: [0, 0.1, 1],
                outputRange: [0, 1.2, 1]
              })
            }
          ]
        }}
      >
        <Image
          source={images.levelBall}
          style={{
            width: 28,
            height: 28,
            resizeMode: 'contain'
          }}
        />
      </Animated.View>
    </View>
  );
}

export default function TopBar() {
  return (
    <View className="flex-row items-center justify-between px-4 pt-5 pb-3">
      {/* Level Section */}
      <View className="flex-[2]">
        <View className="flex-row items-center">
          <LevelProgressBar progress={0.5} />
          <Text className="ml-2 text-xs font-OpenSansBold text-gray-700">
            Lv.1
          </Text>
        </View>
        <Text className="text-[12px] text-gray-500 font-OpenSans mt-1">
          500/1000 XP
        </Text>
      </View>

      {/* Coins and Notification */}
      <View className="flex-row items-center space-x-3">
        {/* Coins */}
        <View className="flex-row items-center bg-white px-4 py-2 rounded-full shadow-sm">
          <Image
            source={images.coinImg}
            className="w-5 h-5"
            resizeMode="contain"
          />
          <Text className="ml-2 font-OpenSansBold text-gray-700">
            1,234
          </Text>
        </View>

        {/* Notification Bell */}
        <View className="relative ml-2">
          <View className="bg-white p-2 rounded-full shadow-sm">
            <Ionicons name="notifications" size={24} color="#6C63FF" />
            <View className="absolute -top-1 -right-1 w-[18px] h-[18px] bg-red-500 rounded-full items-center justify-center border-2 border-white">
              <Text className="text-[10px] text-white font-OpenSansBold">
                3
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
