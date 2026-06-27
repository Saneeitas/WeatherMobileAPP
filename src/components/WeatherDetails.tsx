import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { WeatherData, TemperatureUnit } from '@/types/weather';
import { formatWindSpeed } from '@/utils/helpers';

interface WeatherDetailsProps {
  weather: WeatherData;
  unit?: TemperatureUnit;
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

export function WeatherDetails({ weather, unit = 'metric' }: WeatherDetailsProps) {
  const details: DetailItem[] = [
    {
      icon: 'water-outline',
      label: 'Humidity',
      value: `${weather.humidity}%`,
    },
    {
      icon: 'speedometer-outline',
      label: 'Wind',
      value: formatWindSpeed(weather.windSpeed, unit),
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
      <Text style={styles.title}>Details</Text>
      <View style={styles.grid}>
        {details.map((item) => (
          <View key={item.label} style={styles.item}>
            <View style={styles.iconBg}>
              <Ionicons name={item.icon} size={20} color={Colors.primary} />
            </View>
            <Text style={styles.value}>{item.value}</Text>
            <Text style={styles.label}>{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textDark,
    marginBottom: 14,
    letterSpacing: -0.3,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: Colors.cardBackgroundSolid,
    borderRadius: 20,
    padding: 12,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  item: {
    width: '33.33%',
    alignItems: 'center',
    paddingVertical: 16,
  },
  iconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  value: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textDark,
    marginBottom: 2,
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.textMuted,
    letterSpacing: 0.2,
  },
});
