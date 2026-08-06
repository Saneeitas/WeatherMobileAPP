import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getWeatherIcon } from '@/constants/weatherIcons';

interface WeatherIconProps {
  conditionId: number;
  iconCode: string;
  size?: number;
  color?: string;
}

export function WeatherIcon({ conditionId, iconCode, size = 48, color }: WeatherIconProps) {
  const mapping = getWeatherIcon(conditionId, iconCode);
  const iconColor = color || mapping.color;

  return (
    <View style={styles.container}>
      <Ionicons name={mapping.icon} size={size} color={iconColor} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
