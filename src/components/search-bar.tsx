import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChangeText, placeholder = 'Search...' }: SearchBarProps) {
  const theme = useTheme();

  return (
    <View style={styles.searchContainer}>
      <ThemedView
        type="backgroundSelected"
        style={[styles.searchBar, { borderColor: theme.border }]}
      >
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          placeholder={placeholder}
          placeholderTextColor={theme.textSecondary}
          value={value}
          onChangeText={onChangeText}
          autoCorrect={false}
        />
        {value.trim().length > 0 && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onChangeText('')}
            style={styles.clearSearchBtn}
          >
            <ThemedText themeColor="textSecondary" style={styles.clearSearchText}>✕</ThemedText>
          </TouchableOpacity>
        )}
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.two,
  },
  searchBar: {
    borderRadius: Spacing.two,
    borderWidth: 1,
    paddingHorizontal: Spacing.three,
    height: 44, // Fixed height to prevent size jumps
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    padding: 0,
  },
  clearSearchBtn: {
    padding: Spacing.one,
    marginLeft: Spacing.one,
  },
  clearSearchText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
