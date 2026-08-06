import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';
import { TemperatureUnit } from '@/types/weather';

interface TemperatureDisplayProps {
  temperature: number;
  unit: TemperatureUnit;
  size?: 'large' | 'medium' | 'small';
  color?: string;
}

export function TemperatureDisplay({
  temperature,
  unit,
  size = 'medium',
  color,
}: TemperatureDisplayProps) {
  const unitSymbol = unit === 'metric' ? 'C' : 'F';
  const displayTemp = Math.round(temperature);

  const textStyle = [
    styles.base,
    size === 'large' && styles.large,
    size === 'medium' && styles.medium,
    size === 'small' && styles.small,
    color ? { color } : null,
  ];

  return (
    <Text style={textStyle}>
      {displayTemp}°{unitSymbol}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    fontWeight: '300',
    color: Colors.textPrimary,
  },
  large: {
    fontSize: 72,
    lineHeight: 80,
  },
  medium: {
    fontSize: 36,
    lineHeight: 42,
  },
  small: {
    fontSize: 18,
    lineHeight: 24,
  },
});
