import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { HomeScreen } from '@/screens/HomeScreen';
import { ForecastScreen } from '@/screens/ForecastScreen';
import { LocationsScreen } from '@/screens/LocationsScreen';
import { SettingsScreen } from '@/screens/SettingsScreen';

const Tab = createBottomTabNavigator();

type TabIconName = keyof typeof Ionicons.glyphMap;

const TAB_ICONS: Record<string, { focused: TabIconName; unfocused: TabIconName }> = {
  Home: { focused: 'home', unfocused: 'home-outline' },
  Forecast: { focused: 'calendar', unfocused: 'calendar-outline' },
  Locations: { focused: 'location', unfocused: 'location-outline' },
  Settings: { focused: 'settings', unfocused: 'settings-outline' },
};

export function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const icons = TAB_ICONS[route.name];
          const iconName = focused ? icons.focused : icons.unfocused;
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.mediumGray,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Forecast" component={ForecastScreen} />
      <Tab.Screen name="Locations" component={LocationsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.white,
    borderTopColor: Colors.lightGray,
    paddingBottom: 4,
    height: 60,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
});
