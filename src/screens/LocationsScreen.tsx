import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SearchBar } from '@/components/SearchBar';
import { LocationCard } from '@/components/LocationCard';
import { Header } from '@/components/Header';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useLocation } from '@/hooks/useLocation';
import { useWeather } from '@/hooks/useWeather';
import { Colors } from '@/constants/colors';
import { Config } from '@/constants/config';
import { SavedLocation, Coordinates } from '@/types/weather';
import { WeatherService } from '@/services/weatherApi';

interface SearchResult {
  name: string;
  country: string;
  coordinates: Coordinates;
}

export function LocationsScreen() {
  const { state: locationState, addLocation, removeLocation, selectLocation } = useLocation();
  const { fetchWeather } = useWeather();
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = useCallback(async (query: string) => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await WeatherService.searchCity(query);
      setSearchResults(
        results.map((r) => ({
          name: r.name,
          country: r.country,
          coordinates: { latitude: r.lat, longitude: r.lon },
        }))
      );
    } catch {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleAddLocation = useCallback(
    async (result: SearchResult) => {
      await addLocation(result.name, result.country, result.coordinates);
      setSearchResults([]);
    },
    [addLocation]
  );

  const handleRemoveLocation = useCallback(
    (id: string) => {
      Alert.alert(
        'Remove Location',
        'Are you sure you want to remove this location?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Remove', style: 'destructive', onPress: () => removeLocation(id) },
        ]
      );
    },
    [removeLocation]
  );

  const handleSelectLocation = useCallback(
    (location: SavedLocation) => {
      selectLocation(location);
      fetchWeather(location.coordinates.latitude, location.coordinates.longitude);
    },
    [selectLocation, fetchWeather]
  );

  const renderSearchResult = ({ item }: { item: SearchResult }) => (
    <TouchableOpacity style={styles.searchResult} onPress={() => handleAddLocation(item)}>
      <Ionicons name="add-circle-outline" size={22} color={Colors.primary} />
      <View style={styles.searchResultText}>
        <Text style={styles.searchResultName}>{item.name}</Text>
        <Text style={styles.searchResultCountry}>{item.country}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderSavedLocation = ({ item }: { item: SavedLocation }) => (
    <LocationCard
      location={item}
      onPress={handleSelectLocation}
      onDelete={handleRemoveLocation}
    />
  );

  return (
    <View style={styles.container}>
      <Header title="Locations" subtitle={`${locationState.savedLocations.length}/${Config.defaults.maxSavedLocations} saved`} />

      <SearchBar onSearch={handleSearch} placeholder="Search for a city..." />

      {isSearching && (
        <View style={styles.searchingContainer}>
          <LoadingSpinner size="small" message="Searching..." />
        </View>
      )}

      {searchResults.length > 0 && (
        <View style={styles.resultsContainer}>
          <FlatList
            data={searchResults}
            renderItem={renderSearchResult}
            keyExtractor={(item) => `${item.name}-${item.coordinates.latitude}-${item.coordinates.longitude}`}
            style={styles.resultsList}
          />
        </View>
      )}

      <FlatList
        data={locationState.savedLocations}
        renderItem={renderSavedLocation}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.locationsList}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="location-outline" size={48} color={Colors.mediumGray} />
            <Text style={styles.emptyText}>No saved locations</Text>
            <Text style={styles.emptySubtext}>Search for a city to add it here</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.offWhite,
    paddingTop: 48,
  },
  searchingContainer: {
    height: 60,
  },
  resultsContainer: {
    backgroundColor: Colors.cardBackgroundSolid,
    marginHorizontal: 16,
    borderRadius: 12,
    maxHeight: 200,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  resultsList: {
    padding: 4,
  },
  searchResult: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.lightGray,
  },
  searchResultText: {
    marginLeft: 10,
    flex: 1,
  },
  searchResultName: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.textDark,
  },
  searchResultCountry: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 2,
  },
  locationsList: {
    paddingTop: 12,
    paddingBottom: 24,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyText: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.textMuted,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.mediumGray,
    marginTop: 6,
  },
});
