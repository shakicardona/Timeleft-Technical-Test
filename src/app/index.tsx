import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EventCard } from '@/components/event-card';
import { FilterPanel } from '@/components/filter-panel';
import { Header } from '@/components/header';
import { SearchBar } from '@/components/search-bar';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useEvents } from '@/hooks/useEvents';

export default function HomeScreen() {
  const theme = useTheme();
  const {
    events,
    isLoading,
    isRefreshing,
    refresh,
    error,
    searchQuery,
    setSearchQuery,
    selectedCity,
    setSelectedCity,
    uniqueCities,
    uniqueTypes,
    selectedType,
    setSelectedType,
    selectedStatuses,
    setSelectedStatuses,
    sortBy,
    setSortBy,
    resetFilters
  } = useEvents();

  const [showFilters, setShowFilters] = useState(false);

  // loading
  if (isLoading && !isRefreshing) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ActivityIndicator size="large" color={theme.primary} />
        <ThemedText style={{ marginTop: Spacing.three }}>Loading events...</ThemedText>
      </ThemedView>
    );
  }

  // error
  if (error) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ThemedText type="subtitle" style={{ color: theme.error }}>Error</ThemedText>
        <ThemedText style={{ marginVertical: Spacing.two, textAlign: 'center' }}>{error}</ThemedText>
        <TouchableOpacity 
          style={[styles.btnPrimary, { backgroundColor: theme.primary }]}
          onPress={() => refresh()}
        >
          <Text style={styles.btnText}>Retry</Text>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        
        {/* Header Title */}
        <Header
          title="Discover Events"
          rightElement={
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setShowFilters(prev => !prev)}
              style={[
                styles.filterToggleBtn,
                showFilters && { backgroundColor: theme.primary + '15' }
              ]}
            >
              <View style={styles.filterIconContainer}>
                <View style={[styles.filterLine, { width: 18, backgroundColor: showFilters ? theme.primary : theme.textSecondary }]} />
                <View style={[styles.filterLine, { width: 12, backgroundColor: showFilters ? theme.primary : theme.textSecondary }]} />
                <View style={[styles.filterLine, { width: 6, backgroundColor: showFilters ? theme.primary : theme.textSecondary }]} />
              </View>
            </TouchableOpacity>
          }
        />

        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by city, zone, country..."
        />

        {/* Backdrop for filter panel (blocks background touches and scrolls) */}
        {showFilters && (
          <TouchableOpacity
            activeOpacity={1}
            style={styles.backdrop}
            onPress={() => setShowFilters(false)}
          />
        )}

        {/* Collapsible Filter Panel wrapper */}
        <View style={styles.filterPanelWrapper}>
          <FilterPanel
            visible={showFilters}
            uniqueCities={uniqueCities}
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
            uniqueTypes={uniqueTypes}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            selectedStatuses={selectedStatuses}
            setSelectedStatuses={setSelectedStatuses}
            sortBy={sortBy}
            setSortBy={setSortBy}
            resetFilters={resetFilters}
          />
        </View>

        {/* Scrollable Event List */}
        <FlatList
          data={events}
          keyExtractor={(item) => item.id.toString()}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          refreshing={isRefreshing}
          onRefresh={refresh}
          renderItem={({ item }) => <EventCard event={item} />}
          
          // Empty State
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <ThemedText type="default" style={styles.emptyTitle}>
                No events found
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary" style={styles.emptyText}>
                Try adjusting your search query or clear the search bar.
              </ThemedText>
              <TouchableOpacity 
                style={[styles.btnPrimary, { backgroundColor: theme.primary }]}
                onPress={() => setSearchQuery('')}
              >
                <Text style={styles.btnText}>Clear Search</Text>
              </TouchableOpacity>
            </View>
          }
        />

      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    zIndex: 90,
  },
  filterPanelWrapper: {
    position: 'relative',
    zIndex: 999,
    marginHorizontal: Spacing.four,
  },
  filterToggleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3.5,
  },
  filterLine: {
    height: 2,
    borderRadius: 1,
  },

  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.four,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.six,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.six,
    paddingHorizontal: Spacing.four,
  },
  emptyTitle: {
    fontWeight: 'bold',
    marginBottom: Spacing.one,
  },
  emptyText: {
    textAlign: 'center',
    marginBottom: Spacing.four,
  },
  btnPrimary: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
  },
  btnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
