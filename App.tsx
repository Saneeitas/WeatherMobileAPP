import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { WeatherProvider } from '@/context/WeatherContext';
import { LocationProvider } from '@/context/LocationContext';
import { AppNavigator } from '@/navigation/AppNavigator';

const linking = {
  prefixes: [],
};

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer linking={linking}>
        <WeatherProvider>
          <LocationProvider>
            <AppNavigator />
            <StatusBar style="auto" />
          </LocationProvider>
        </WeatherProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
