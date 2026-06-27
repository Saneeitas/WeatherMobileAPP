import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, Switch, ScrollView, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '@/components/Header';
import { useWeather } from '@/hooks/useWeather';
import { useLocation } from '@/hooks/useLocation';
import { Colors } from '@/constants/colors';
import { TemperatureUnit } from '@/types/weather';

export function SettingsScreen() {
  const { state: weatherState, setTemperatureUnit } = useWeather();
  const { state: locationState, clearAllLocations } = useLocation();
  const { temperatureUnit } = weatherState;

  const isImperial = temperatureUnit === 'imperial';

  const handleUnitToggle = useCallback(
    (value: boolean) => {
      const unit: TemperatureUnit = value ? 'imperial' : 'metric';
      setTemperatureUnit(unit);
    },
    [setTemperatureUnit]
  );

  const handleClearLocations = useCallback(() => {
    if (locationState.savedLocations.length === 0) {
      Alert.alert('No Locations', 'There are no saved locations to clear.');
      return;
    }

    Alert.alert(
      'Clear All Locations',
      'Are you sure you want to remove all saved locations? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => clearAllLocations(),
        },
      ]
    );
  }, [locationState.savedLocations, clearAllLocations]);

  return (
    <View style={styles.container}>
      <Header title="Settings" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Temperature Unit */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <View style={styles.iconBg}>
                  <Ionicons name="thermometer-outline" size={18} color={Colors.primary} />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingLabel}>Temperature Unit</Text>
                  <Text style={styles.settingDescription}>
                    {isImperial ? 'Fahrenheit (°F)' : 'Celsius (°C)'}
                  </Text>
                </View>
              </View>
              <View style={styles.toggleContainer}>
                <Text style={[styles.unitLabel, !isImperial && styles.unitLabelActive]}>°C</Text>
                <Switch
                  value={isImperial}
                  onValueChange={handleUnitToggle}
                  trackColor={{ false: Colors.primaryLight, true: Colors.primaryLight }}
                  thumbColor={Colors.white}
                />
                <Text style={[styles.unitLabel, isImperial && styles.unitLabelActive]}>°F</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Data Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.settingRow} onPress={handleClearLocations} activeOpacity={0.7}>
              <View style={styles.settingLeft}>
                <View style={[styles.iconBg, { backgroundColor: '#FEF2F2' }]}>
                  <Ionicons name="trash-outline" size={18} color={Colors.error} />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={[styles.settingLabel, { color: Colors.error }]}>
                    Clear Saved Locations
                  </Text>
                  <Text style={styles.settingDescription}>
                    {locationState.savedLocations.length} location(s) saved
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.mediumGray} />
            </TouchableOpacity>
          </View>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <View style={styles.iconBg}>
                  <Ionicons name="information-circle-outline" size={18} color={Colors.primary} />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingLabel}>App Version</Text>
                  <Text style={styles.settingDescription}>1.0.0</Text>
                </View>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <View style={styles.iconBg}>
                  <Ionicons name="cloud-outline" size={18} color={Colors.primary} />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingLabel}>Weather Data</Text>
                  <Text style={styles.settingDescription}>Powered by OpenWeatherMap</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.offWhite,
    paddingTop: 52,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
    marginLeft: 4,
  },
  card: {
    backgroundColor: Colors.cardBackgroundSolid,
    borderRadius: 18,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingTextContainer: {
    marginLeft: 14,
    flex: 1,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textDark,
    letterSpacing: -0.2,
  },
  settingDescription: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textMuted,
    marginTop: 2,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  unitLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.mediumGray,
    marginHorizontal: 6,
  },
  unitLabelActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginHorizontal: 16,
  },
});
