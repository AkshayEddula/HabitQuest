import React, { useState, useRef, useEffect } from 'react';
import {
    Image,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "@/constants";
import '../../global.css';
import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from '@/firebase/config';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Animation refs
    const illustrationScale = useRef(new Animated.Value(0.8)).current;
    const socialButtonsOpacity = useRef(new Animated.Value(0)).current;
    const buttonTranslateY = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        // Parallel animation for illustration scale and social buttons
        Animated.parallel([
            Animated.spring(illustrationScale, {
                toValue: 1,
                friction: 3,
                tension: 40,
                useNativeDriver: true,
            }),
            Animated.timing(socialButtonsOpacity, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.spring(buttonTranslateY, {
                toValue: 0,
                friction: 5,
                tension: 40,
                useNativeDriver: true,
            })
        ]).start();
    }, []);

    const handleSignup = async ( e: React.FormEvent ) => {
        console.log('Signup pressed');
        e.preventDefault();
        try {
            const userCredentials = await createUserWithEmailAndPassword(auth, email,password);
            await sendEmailVerification(userCredentials.user);
            router.push('/(auth)/conformation');
        } catch (error) {
            console.error('Error during signup:', error);
        }
    };

    return (
        <SafeAreaView className="bg-white h-full">
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                <ScrollView
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{ flexGrow: 1 }}
                >
                    {/* Hero Section */}
                    <Animated.View
                        className="relative"
                        style={{
                            transform: [{
                                scale: illustrationScale
                            }]
                        }}
                    >
                        {/* Glow Effect (Positioned Left) */}
                        <View className="absolute right-0 top-0">
                            <Image
                                source={images.glowEffect}
                                className="w-[250px] h-[250px]"
                                resizeMode="contain"
                            />
                        </View>

                        {/* Signup Illustration */}
                        <View className="relative -z-10">
                            <Image
                                source={images.signupImg}
                                className="w-full h-[250px]"
                                resizeMode="contain"
                            />
                        </View>
                    </Animated.View>

                    {/* Form Container */}
                    <View
                        className="bg-white rounded-t-[30px] -mt-10 pt-8 px-6 flex-1"
                        style={{
                            shadowColor: "#000",
                            shadowOffset: {
                                width: 0,
                                height: -10,
                            },
                            shadowOpacity: 0.1,
                            shadowRadius: 10,
                            elevation: 5
                        }}
                    >
                        <Text className="text-[24px] text-center font-OpenSansBold text-[#1e1e1e] mb-8">
                            Get Started Free
                        </Text>

                        {/* Email Input */}
                        <View className="mb-4">
                            <Text className="text-[#666] mb-2">Email Address</Text>
                            <View
                                className="flex-row items-center border border-[#E2E8F0] rounded-lg px-3 bg-white"
                                style={{
                                    shadowColor: "#000",
                                    shadowOffset: { width: 0, height: 1 },
                                    shadowOpacity: 0.1,
                                    shadowRadius: 2,
                                    elevation: 2,
                                    backgroundColor: 'white',
                                }}
                            >
                                <AntDesign name="mail" size={20} color="#6C63FF" />
                                <TextInput
                                    placeholder="Enter your email"
                                    value={email}
                                    onChangeText={setEmail}
                                    className="flex-1 ml-2 py-3 text-[16px] font-OpenSans"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>
                        </View>

                        {/* Password Input */}
                        <View className="mb-6">
                            <Text className="text-[#666] mb-2">Password</Text>
                            <View
                                className="flex-row items-center border border-[#E2E8F0] rounded-lg px-3 bg-white"
                                style={{
                                    shadowColor: "#000",
                                    shadowOffset: { width: 0, height: 1 },
                                    shadowOpacity: 0.1,
                                    shadowRadius: 2,
                                    elevation: 2,
                                    backgroundColor: 'white',
                                }}
                            >
                                <AntDesign name="lock" size={20} color="#6C63FF" />
                                <TextInput
                                    placeholder="Create a password"
                                    value={password}
                                    onChangeText={setPassword}
                                    className="flex-1 ml-2 py-3 text-[16px] font-OpenSans"
                                    secureTextEntry={!showPassword}
                                    autoCapitalize="none"
                                />
                                <TouchableOpacity
                                    onPress={() => setShowPassword(!showPassword)}
                                    className="p-2"
                                >
                                    <AntDesign
                                        name={showPassword ? "eye" : "eyeo"}
                                        size={20}
                                        color="#6C63FF"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Signup Button */}
                        <TouchableOpacity
                            onPress={handleSignup}
                            className="bg-[#6C63FF] rounded-lg py-4 items-center"
                            style={{
                                shadowColor: "#6C63FF",
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.3,
                                shadowRadius: 4,
                                elevation: 5,
                            }}
                        >
                            <Text className="text-white text-[16px] font-OpenSansBold">
                                Sign Up
                            </Text>
                        </TouchableOpacity>

                        {/* Divider */}
                        <View className="flex-row items-center my-6">
                            <View className="flex-1 h-[1px] bg-[#E2E8F0]" />
                            <Text className="mx-4 text-[#666]">or</Text>
                            <View className="flex-1 h-[1px] bg-[#E2E8F0]" />
                        </View>

                        {/* Social Signup */}
                        <Animated.View
                            className="flex flex-row justify-center space-x-2"
                            style={{
                                opacity: socialButtonsOpacity,
                                transform: [{
                                    translateY: buttonTranslateY
                                }]
                            }}
                        >
                            <TouchableOpacity
                                className="border mx-2 border-[#E2E8F0] p-3 rounded-lg"
                            >
                                <AntDesign name="google" size={24} color="#6C63FF" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="border mx-2 border-[#E2E8F0] p-3 rounded-lg"
                            >
                                <AntDesign name="facebook-square" size={24} color="#6C63FF" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="border mx-2 border-[#E2E8F0] p-3 rounded-lg"
                            >
                                <AntDesign name="apple1" size={24} color="#6C63FF" />
                            </TouchableOpacity>
                        </Animated.View>

                        {/* Login Link */}
                        <View className="flex-row justify-center mt-6">
                            <Text className="text-[#666]">
                                Already have an account?
                            </Text>
                            <TouchableOpacity
                                onPress={() => router.push("/(auth)/signin")}
                            >
                                <Text className="text-[#6C63FF] font-OpenSansBold ml-2">
                                    Log In
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default Signup;
