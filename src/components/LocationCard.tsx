import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { SavedLocation } from '@/types/weather';

interface LocationCardProps {
  location: SavedLocation;
  onPress: (location: SavedLocation) => void;
  onDelete: (id: string) => void;
}

export function LocationCard({ location, onPress, onDelete }: LocationCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(location)}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="location" size={20} color={Colors.primary} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.cityName}>{location.name}</Text>
          <Text style={styles.country}>{location.country}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDelete(location.id)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="trash-outline" size={18} color={Colors.error} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.cardBackgroundSolid,
    borderRadius: 18,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 5,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  textContainer: {
    flex: 1,
  },
  cityName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textDark,
    letterSpacing: -0.2,
    marginBottom: 2,
  },
  country: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textMuted,
  },
  deleteButton: {
    padding: 8,
  },
});
