import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EventCard } from '@/components/event-card';
import { Header } from '@/components/header';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useEvents } from '@/hooks/useEvents';

export default function HomeScreen() {
  const { events, isLoading, isRefreshing, refresh, error } = useEvents();

  // if loading
  if (isLoading && !isRefreshing) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#3c87f7" />
        <ThemedText style={{ marginTop: Spacing.three }}>Loading events...</ThemedText>
      </ThemedView>
    );
  }

  // if error
  if (error) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ThemedText type="subtitle" style={{ color: '#E53E3E' }}>Error</ThemedText>
        <ThemedText style={{ marginVertical: Spacing.two, textAlign: 'center' }}>{error}</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>

        <Header title="Discover Events" />

        {/* Scrollable Event List */}
        <FlatList
          data={events}
          keyExtractor={(item) => item.id.toString()}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          refreshing={isRefreshing}
          onRefresh={refresh}
          renderItem={({ item }) => (
            <EventCard event={item} />
          )}
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
    paddingBottom: Spacing.five,
  },
});
