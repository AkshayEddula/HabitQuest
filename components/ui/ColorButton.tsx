import { TouchableOpacity } from 'react-native';
import { memo, useCallback } from 'react';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';

interface ColorButtonProps {
  color: string;
  isSelected: boolean;
  onSelect: () => void;
}

export const ColorButton = memo(({ color, isSelected, onSelect }: ColorButtonProps) => {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{
      scale: withSpring(isSelected ? 1.1 : 1, {
        mass: 0.5,
        damping: 12,
      })
    }],
  }));

  const containerStyle = useCallback(() => ({
    backgroundColor: color,
    borderRadius: 24, // Add this for the Animated.View
    ...(isSelected && {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    })
  }), [color, isSelected]);

  return (
    <Animated.View
      style={[containerStyle(), animatedStyle]}
      className="w-12 h-12 mr-3" // Add size here
    >
      <TouchableOpacity
        onPress={onSelect}
        className="w-full h-full rounded-full" // Make it take full size of parent
        style={{
          borderWidth: isSelected ? 4 : 0,
          borderColor: 'white',
        }}
      />
    </Animated.View>
  );
});
