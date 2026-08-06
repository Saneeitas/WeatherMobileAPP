import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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

const TAB_BAR_HEIGHT = 64;

export function AppNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const icons = TAB_ICONS[route.name];
          const iconName = focused ? icons.focused : icons.unfocused;
          return <Ionicons name={iconName} size={size - 2} color={color} />;
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.mediumGray,
        tabBarStyle: [
          styles.tabBar,
          {
            height: TAB_BAR_HEIGHT + insets.bottom,
            paddingBottom: insets.bottom > 0 ? insets.bottom : 6,
          },
        ],
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarItemStyle: styles.tabBarItem,
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
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 8,
    elevation: 0,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  tabBarItem: {
    paddingTop: 2,
  },
});
