import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Profile() {
    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-1 px-4 pt-4">
                <Text className="text-2xl font-OpenSansBold text-gray-800">
                    Profile
                </Text>
            </View>
        </SafeAreaView>
    );
}