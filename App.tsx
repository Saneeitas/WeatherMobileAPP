import React, { useState, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { WeatherProvider } from '@/context/WeatherContext';
import { LocationProvider } from '@/context/LocationContext';
import { AppNavigator } from '@/navigation/AppNavigator';
import { SplashScreen } from '@/components/SplashScreen';

const linking = {
  prefixes: [],
};

export default function App() {
  const [isReady, setIsReady] = useState(false);

  const handleSplashFinish = useCallback(() => {
    setIsReady(true);
  }, []);

  if (!isReady) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

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
