import { TextInput, TextInputProps, View, Text } from 'react-native';

interface FormInputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const FormInput = memo(({
  label,
  error,
  className = '',
  ...props
}: FormInputProps) => (
  <View className="mb-4">
    {label && (
      <Text className="text-sm text-gray-500 mb-2 font-OpenSans">
        {label}
      </Text>
    )}
    <TextInput
      className={`text-[16px] font-OpenSansSemiBold text-gray-800 p-4 bg-gray-50 rounded-xl ${
        error ? 'border border-red-500' : ''
      } ${className}`}
      placeholderTextColor="#94A3B8"
      {...props}
    />
    {error && (
      <Text className="text-xs text-red-500 mt-1 font-OpenSans">
        {error}
      </Text>
    )}
  </View>
));
