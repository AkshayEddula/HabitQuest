import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View, TouchableOpacity, Dimensions } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

function TabBarBackground() {
  return (
    <View
      style={{
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        height: 70,
        backgroundColor: 'white',
        borderRadius: 20,
        shadowColor: '#6C63FF',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
      }}
    >
      <BlurView
        intensity={95}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: 20,
          overflow: 'hidden',
        }}
      />
    </View>
  );
}

function FloatingAddButton() {
  const handlePress = () => {
    router.push('/(tabs)/habit');
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={{
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#6C63FF',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#6C63FF',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
        transform: [{ translateY: 0 }],
      }}
    >
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: 25,
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: 'rgba(108, 99, 255, 0.3)',
        }}
      />
      <AntDesign name="plus" size={24} color="white" />
    </TouchableOpacity>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <ProtectedRoute>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#6C63FF',
          tabBarInactiveTintColor: '#94A3B8',
          headerShown: false,
          tabBarBackground: TabBarBackground,
          tabBarStyle: {
            position: 'absolute',
            height: 90,
            bottom: 0,
            left: 20,
            right: 20,
            borderRadius: 20,
            borderTopWidth: 0,
            backgroundColor: 'transparent',
            elevation: 0,
            paddingHorizontal: 20,
            zIndex: 0,
          },
          tabBarItemStyle: {
            height: 60,
            paddingTop: 8,
            paddingBottom: 8,
          },
          tabBarIconStyle: {
            marginBottom: 4,
          },
          tabBarLabelStyle: {
            fontFamily: 'OpenSans-Medium',
            fontSize: 12,
          }
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, focused }) => (
              <View style={{
                width: 36,
                height: 36,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: focused ? 'rgba(108, 99, 255, 0.1)' : 'transparent',
                borderRadius: 10,
              }}>
                <Ionicons name="home" size={20} color={color} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="analytics"
          options={{
            title: 'Analytics',
            tabBarIcon: ({ color, focused }) => (
              <View style={{
                width: 40,
                height: 40,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: focused ? 'rgba(108, 99, 255, 0.1)' : 'transparent',
                borderRadius: 12,
              }}>
                <Ionicons name="stats-chart" size={22} color={color} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="habit"
          options={{
            title: '',
            tabBarButton: () => <FloatingAddButton />,
          }}
        />
        <Tabs.Screen
          name="manage"
          options={{
            title: 'Manage',
            tabBarIcon: ({ color, focused }) => (
              <View style={{
                width: 40,
                height: 40,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: focused ? 'rgba(108, 99, 255, 0.1)' : 'transparent',
                borderRadius: 12,
              }}>
                <Ionicons name="list" size={22} color={color} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, focused }) => (
              <View style={{
                width: 40,
                height: 40,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: focused ? 'rgba(108, 99, 255, 0.1)' : 'transparent',
                borderRadius: 12,
              }}>
                <Ionicons name="person" size={22} color={color} />
              </View>
            ),
          }}
        />
      </Tabs>
    </ProtectedRoute>
  );
}
