// app/(tabs)/_layout.tsx
import { icons } from '@/constants/icons';
import { images } from '@/constants/images';
import { Tabs } from 'expo-router';
import React from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  Platform // ✅ FIXED: added import
  ,
  Text,
  View
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface TabIconProps {
  focused: boolean;
  icon: any;
  title: string;
}

const TabIcon = ({ focused, icon, title }: TabIconProps) => {
  if (focused) {
    return (
      <ImageBackground
        source={images.highlight}
        className="flex flex-row w-full flex-1 min-w-[90px] min-h-14 mt-3 justify-center items-center rounded-2xl overflow-hidden"
        imageStyle={{ borderRadius: 16 }}
        resizeMode="cover"
      >
        <View className="flex-row items-center justify-center px-3">
          <Image 
            source={icon} 
            tintColor="#151312" 
            className="w-5 h-5" 
            resizeMode="contain"
          />
          <Text className="text-secondary text-sm font-bold ml-2 tracking-wide">
            {title}
          </Text>
        </View>
      </ImageBackground>
    );
  }

  return (
    <View className="flex justify-center items-center mt-4 p-3 rounded-xl">
      <Image 
        source={icon} 
        tintColor="#A0A0A0" 
        className="w-6 h-6" 
        resizeMode="contain"
      />
      <Text className="text-gray-400 text-xs font-medium mt-1">
        {title}
      </Text>
    </View>
  );
};

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarItemStyle: {
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 0,
          margin: 0,
        },
        tabBarStyle: {
          backgroundColor: 'rgba(30, 28, 26, 0.95)',
          borderTopWidth: 0,
          height: 72,
          elevation: 0,
          marginBottom: 20,
          marginHorizontal: 20,
          borderRadius: 20,
          position: 'absolute',
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.1)',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 12,
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 12,
            },
            android: {
              elevation: 8,
            },
          }),
        },
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.home} title="Home" />
          ),
        }}
      />
      
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.search} title="Search" />
          ),
        }}
      />
      
      <Tabs.Screen
        name="discover"
        options={{
          title: 'Discover',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.arrow} title="Discover" />
          ),
        }}
      />
      
      <Tabs.Screen
        name="surprise"
        options={{
          title: 'Surprise',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.star} title="Watchlist" />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
