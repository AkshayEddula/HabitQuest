import { TouchableOpacity } from 'react-native';
import { memo } from 'react';

interface ColorButtonProps {
  color: string;
  isSelected: boolean;
  onSelect: () => void;
}

export const ColorButton = memo(({ color, isSelected, onSelect }: ColorButtonProps) => (
  <TouchableOpacity
    onPress={onSelect}
    style={{
      backgroundColor: color,
      transform: [{ scale: 1 }],
      ...(isSelected && {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }),
    }}
    className={`w-12 h-12 rounded-full mr-3 transition-transform duration-200 ${
      isSelected ? 'border-4 border-white scale-110' : ''
    }`}
  />
));
