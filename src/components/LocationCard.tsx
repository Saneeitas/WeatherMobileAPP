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
          <Ionicons name="location" size={24} color={Colors.primary} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.cityName}>{location.name}</Text>
          <Text style={styles.country}>{location.country}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDelete(location.id)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons name="trash-outline" size={20} color={Colors.error} />
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
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.offWhite,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  cityName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textDark,
    marginBottom: 2,
  },
  country: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  deleteButton: {
    padding: 8,
  },
});
