import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';

// Placeholder screens - will be replaced by actual screen components in FEAT-002
function HomeScreen() {
  return (
    <View style={styles.placeholder}>
      <Text style={styles.placeholderText}>Home Screen</Text>
      <Text style={styles.placeholderSubtext}>Current weather will appear here</Text>
    </View>
  );
}

function ForecastScreen() {
  return (
    <View style={styles.placeholder}>
      <Text style={styles.placeholderText}>Forecast Screen</Text>
      <Text style={styles.placeholderSubtext}>5-day forecast will appear here</Text>
    </View>
  );
}

function LocationsScreen() {
  return (
    <View style={styles.placeholder}>
      <Text style={styles.placeholderText}>Locations Screen</Text>
      <Text style={styles.placeholderSubtext}>Saved locations will appear here</Text>
    </View>
  );
}

function SettingsScreen() {
  return (
    <View style={styles.placeholder}>
      <Text style={styles.placeholderText}>Settings Screen</Text>
      <Text style={styles.placeholderSubtext}>App settings will appear here</Text>
    </View>
  );
}

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
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopColor: Colors.lightGray,
          paddingBottom: 4,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
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
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.offWhite,
  },
  placeholderText: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textDark,
    marginBottom: 8,
  },
  placeholderSubtext: {
    fontSize: 14,
    color: Colors.textMuted,
  },
});
