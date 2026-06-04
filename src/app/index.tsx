import React from 'react';
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
    setSearchQuery
  } = useEvents();

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
        <Header title="Discover Events" />

        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by city, zone, country..."
        />

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
