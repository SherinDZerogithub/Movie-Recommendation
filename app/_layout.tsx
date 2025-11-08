// app/_layout.tsx (add this screen)
import { Stack } from "expo-router";
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import './globals.css';

// ... existing code ...

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar 
        barStyle="light-content"
        backgroundColor="transparent"
        translucent={true}
      />
      
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: '#000000' },
          gestureEnabled: true,
          gestureDirection: 'horizontal',
        }}
      >
        {/* Main tabs */}
        <Stack.Screen
          name="(tabs)"
          options={{ 
            headerShown: false,
            animation: 'fade',
          }}
        />
        
        {/* Movie details screen */}
        <Stack.Screen
          name="movies/[id]"
          options={{ 
            headerShown: false,
            presentation: 'card',
            animation: 'slide_from_bottom',
            gestureEnabled: true,
            gestureDirection: 'vertical',
          }}
        />

        {/* TV Show details screen */}
        <Stack.Screen
          name="tv/[id]"
          options={{ 
            headerShown: false,
            presentation: 'card',
            animation: 'slide_from_bottom',
            gestureEnabled: true,
          }}
        />

        {/* Search screen */}
        <Stack.Screen
          name="search"
          options={{ 
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />

        {/* Discover screen */}
        <Stack.Screen
          name="discover"
          options={{ 
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />

        {/* NEW: Surprise Me screen - Public access */}
        <Stack.Screen
          name="surprise"
          options={{ 
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}