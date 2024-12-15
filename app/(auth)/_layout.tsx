import { Stack } from "expo-router";

export default function AuthLayout() {
    return (
        <Stack>
            <Stack.Screen name="welcome" options={{headerShown: false}} />
            <Stack.Screen name="signup" options={{headerShown: false}} />
            <Stack.Screen name="signin" options={{headerShown: false}} />
            <Stack.Screen name="conformation" options={{headerShown: false}} />
            <Stack.Screen name="forgotPassword" options={{headerShown: false}} />
        </Stack>
    )
}
