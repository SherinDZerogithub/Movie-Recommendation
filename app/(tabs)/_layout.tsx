import { icons } from '@/constants/icons'
import { images } from '@/constants/images'
import { Tabs } from 'expo-router'
import React from 'react'
import { Image, ImageBackground, Text, View } from 'react-native'

const TabIcon = ({ focused, icon, title }: any) => {
  if (focused) {
    return (
      <ImageBackground
        source={images.highlight}
        className="flex flex-row w-full flex-1 min-w-[97px] min-h-16 mt-4 justify-center items-center rounded-2xl overflow-hidden"
        imageStyle={{ borderRadius: 16 }}
      >
        <View className="flex-row items-center justify-center">
          <Image source={icon} tintColor="#151312" className="size-5" />
          <Text className="text-secondary text-sm font-bold ml-2 tracking-wide">
            {title}
          </Text>
        </View>
      </ImageBackground>
    )
  } else {
    return (
      <View className="flex justify-center items-center mt-4 p-3 rounded-xl">
        <Image source={icon} tintColor="#A0A0A0" className="size-6" />
        <Text className="text-gray-400 text-xs font-medium mt-1">
          {title}
        </Text>
      </View>
    )
  }
}

const _layout = () => {
  return (
    <Tabs screenOptions={{
      tabBarShowLabel: false,
      tabBarItemStyle: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
      },
      tabBarStyle: {
        backgroundColor: 'rgba(30, 28, 26, 0.95)',
        borderTopWidth: 0,
        height: 72,
        elevation: 0,
        marginBottom: 25,
        marginHorizontal: 20,
        borderRadius: 20,
        position: 'absolute',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12
      },
      headerShown: false
    }}>
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
          title: 'discover',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.arrow} title="Discover" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.star} title="Watchlist" />
          ),
        }}
      />
    </Tabs>
  )
}

export default _layout