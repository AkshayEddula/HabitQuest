import { Animated, Image, Text, TouchableOpacity, View, StatusBar, Easing } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Swiper from "react-native-swiper";
import '../../global.css';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { onboarding } from "@/constants";
import { AntDesign } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';
import { router } from "expo-router";
import { useAuth } from '../../context/AuthContext';

const Dot = memo(() => (
    <View className="w-[36px] h-[6px] bg-[#DDEFFF] rounded-full mx-[1px]" />
));

const ActiveDot = memo(() => (
    <View className="w-[32px] h-[6px] bg-[#6C63FF] rounded-full mx-1" />
));

const DecorativeCircle = memo(({
    size,
    opacity,
    blur,
    position,
    index,
    isActive
}: {
    size: number;
    opacity: number;
    blur: number;
    position: {top?: number, bottom?: number, left?: number, right?: number};
    index: number;
    isActive: boolean;
}) => {
    const slideAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Slide and Scale Animation
        if (isActive) {
            Animated.parallel([
                Animated.spring(slideAnim, {
                    toValue: 1,
                    useNativeDriver: true,
                    tension: 40,
                    friction: 6
                }),
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    useNativeDriver: true,
                    tension: 40,
                    friction: 6
                }),
                // Continuous Pulse Animation
                Animated.loop(
                    Animated.sequence([
                        Animated.timing(pulseAnim, {
                            toValue: 1,
                            duration: 1500,
                            easing: Easing.inOut(Easing.ease),
                            useNativeDriver: true
                        }),
                        Animated.timing(pulseAnim, {
                            toValue: 0,
                            duration: 1500,
                            easing: Easing.inOut(Easing.ease),
                            useNativeDriver: true
                        })
                    ])
                ).start()
            ]).start();
        } else {
            slideAnim.setValue(0);
            scaleAnim.setValue(0);
            pulseAnim.setValue(0);
        }

        return () => {
            slideAnim.setValue(0);
            scaleAnim.setValue(0);
            pulseAnim.setValue(0);
        };
    }, [isActive]);

    const getAnimatedStyle = () => {
        let translateX = 0;
        let translateY = 0;

        // More nuanced translation
        switch (index) {
            case 0:
                translateY = slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-30, 0]
                });
                break;
            case 1:
                translateX = slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [30, 0]
                });
                break;
            case 2:
                translateX = slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-30, 0]
                });
                break;
        }

        // Pulse Effect
        const pulseScale = pulseAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 1.1]
        });

        return {
            transform: [
                { translateX },
                { translateY },
                { scale: Animated.multiply(scaleAnim, pulseScale) }
            ],
            opacity: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, opacity]
            })
        };
    };

    if (!isActive) return null;

    return (
        <Animated.View
            style={[{
                position: 'absolute',
                width: size,
                height: size,
                borderRadius: size / 2,
                backgroundColor: index === 0
                    ? 'rgba(108, 99, 255, 0.3)'
                    : 'rgba(108, 99, 255, 0.5)',
                ...position,
                shadowColor: '#6C63FF',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.5,
                shadowRadius: blur,
                elevation: blur,
            },
            getAnimatedStyle(),
            {
                borderWidth: 1,
                borderColor: 'rgba(108, 99, 255, 0.2)',
            }]}
        />
    );
});

const OnboardingSlide = memo(({ item, index, activeIndex }: {
    item: typeof onboarding[0],
    index: number,
    activeIndex: number
}) => (
    <View className="flex items-center justify-center pt-3">
        <View className="w-full h-[300px] relative overflow-hidden">
            <DecorativeCircle
                size={100}
                opacity={0.4}
                blur={20}
                position={{ top: 10, right: -50 }}
                index={0}
                isActive={index === activeIndex}
            />
            <DecorativeCircle
                size={130}
                opacity={0.6}
                blur={30}
                position={{ bottom: -20, left: -30 }}
                index={1}
                isActive={index === activeIndex}
            />
            <DecorativeCircle
                size={50}
                opacity={0.7}
                blur={10}
                position={{ bottom: -10, right: -20 }}
                index={2}
                isActive={index === activeIndex}
            />
            <Image
                source={item.image}
                className="w-full h-[300px]"
                resizeMode="contain"
            />
        </View>
        <View className="flex px-2 mt-2">
            <View className="flex flex-row items-center justify-center mt-10">
                <Text className="text-[#505161] text-[24px] font-OpenSansBold mx-1 text-center">
                    {item.title}
                </Text>
            </View>
            <Text className="text-[18px] leading-8 font-OpenSansLight text-center text-gray-600 mx-2 mt-3">
                {item.description}
            </Text>
        </View>
    </View>
));

const Arc = memo(({ rotation, color }: { rotation: number; color: string }) => (
    <Circle
        cx="50"
        cy="50"
        r="45"
        stroke={color}
        strokeWidth="4"
        strokeDasharray="80 114"
        strokeDashoffset="-97"
        fill="none"
        transform={`rotate(${rotation} 50 50)`}
    />
));

const Welcome = () => {
    const { user } = useAuth();
    const swiperRef = useRef<Swiper>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const isLastSlide = activeIndex === onboarding.length - 1;

    const handleNextSlide = useCallback(() => {
        if (isLastSlide) {
            if (user) {
                router.push('/(tabs)');
            } else {
                router.push('/(auth)/signup');
            }
        } else if (swiperRef.current) {
            swiperRef.current.scrollBy(1);
        }
    }, [isLastSlide, user]);

    const handleSkip = useCallback(() => {
        if (swiperRef.current) {
            swiperRef.current.scrollBy(onboarding.length - activeIndex - 1);
        }
    }, [activeIndex]);

    const getArcColor = useCallback((index: number) => {
        if (index === activeIndex) return "#0286FF";
        return index < activeIndex ? "#6C63FF" : "#E2E8F0";
    }, [activeIndex]);

    const arcColors = useMemo(() => [
        getArcColor(0),
        getArcColor(1),
        getArcColor(2)
    ], [getArcColor]);

    return (
        <>
            <StatusBar barStyle="dark-content" backgroundColor="#F5F7FA" />
            <SafeAreaView
                className="bg-[#F5F7FA] h-full rounded-t-[30px]"
                style={{
                    borderTopLeftRadius: 30,
                    borderTopRightRadius: 30
                }}
            >
                {!isLastSlide && (
                    <TouchableOpacity
                        onPress={handleSkip}
                        className="absolute top-10 right-5 z-10 px-5 py-2 rounded-full bg-white shadow-sm border border-[#E2E8F0]"
                    >
                        <Text className="text-[#6C63FF] text-[15px] font-OpenSansBold">
                            Skip
                        </Text>
                    </TouchableOpacity>
                )}

                <Swiper
                    ref={swiperRef}
                    loop={false}
                    dot={<Dot />}
                    activeDot={<ActiveDot />}
                    onIndexChanged={setActiveIndex}
                    removeClippedSubviews={true}
                >
                    {onboarding.map((item, index) => (
                        <OnboardingSlide
                            key={item.id}
                            item={item}
                            index={index}
                            activeIndex={activeIndex}
                        />
                    ))}
                </Swiper>
                <View className="items-center mt-8 mb-10">
                    <View className="relative w-[100px] h-[100px]">
                        <Svg width="100" height="100" viewBox="0 0 100 100">
                            <Arc rotation={-60} color={arcColors[0]} />
                            <Arc rotation={60} color={arcColors[1]} />
                            <Arc rotation={180} color={arcColors[2]} />
                        </Svg>

                        <View className="absolute top-[20px] left-[20px]">
                            <TouchableOpacity
                                onPress={handleNextSlide}
                                className="w-[60px] h-[60px] bg-[#6C63FF] rounded-full items-center justify-center"
                            >
                                {isLastSlide ? (
                                    <Text className="text-white font-OpenSansBold text-[14px]">Start</Text>
                                ) : (
                                    <AntDesign name="arrowright" size={24} color="white" />
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </>
    );
};

export default Welcome;
