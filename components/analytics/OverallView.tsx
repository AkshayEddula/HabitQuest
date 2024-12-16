import { View, Text } from 'react-native';
import { useHabits } from '@/hooks/useHabits';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function OverallView() {
  const { habits, progress, loading } = useHabits('monthly');

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Animated.View
      entering={FadeInDown.delay(200)}
      className="flex-1 px-4"
    >
      <Text>Overall View Coming Soon</Text>
    </Animated.View>
  );
}
