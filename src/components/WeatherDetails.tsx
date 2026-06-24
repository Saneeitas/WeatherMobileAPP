import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { WeatherData } from '@/types/weather';

interface WeatherDetailsProps {
  weather: WeatherData;
}

interface DetailItem {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}

function formatTime(timestamp: number, timezone: number): string {
  const date = new Date((timestamp + timezone) * 1000);
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHour = hours % 12 || 12;
  return `${displayHour}:${minutes.toString().padStart(2, '0')} ${period}`;
}

export function WeatherDetails({ weather }: WeatherDetailsProps) {
  const details: DetailItem[] = [
    {
      icon: 'water-outline',
      label: 'Humidity',
      value: `${weather.humidity}%`,
    },
    {
      icon: 'speedometer-outline',
      label: 'Wind',
      value: `${weather.windSpeed} m/s`,
    },
    {
      icon: 'thermometer-outline',
      label: 'Pressure',
      value: `${weather.pressure} hPa`,
    },
    {
      icon: 'eye-outline',
      label: 'Visibility',
      value: `${(weather.visibility / 1000).toFixed(1)} km`,
    },
    {
      icon: 'sunny-outline',
      label: 'Sunrise',
      value: formatTime(weather.sunrise, weather.timezone),
    },
    {
      icon: 'moon-outline',
      label: 'Sunset',
      value: formatTime(weather.sunset, weather.timezone),
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weather Details</Text>
      <View style={styles.grid}>
        {details.map((item) => (
          <View key={item.label} style={styles.item}>
            <Ionicons name={item.icon} size={22} color={Colors.primary} />
            <Text style={styles.label}>{item.label}</Text>
            <Text style={styles.value}>{item.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.textDark,
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: Colors.cardBackgroundSolid,
    borderRadius: 16,
    padding: 8,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  item: {
    width: '33.33%',
    alignItems: 'center',
    paddingVertical: 16,
  },
  label: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 6,
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textDark,
    marginTop: 4,
  },
});
