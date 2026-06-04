import React from 'react';
import { StyleSheet, View, ViewStyle, StyleProp } from 'react-native';

import { Spacing } from '@/constants/theme';
import { ThemedText } from './themed-text';

interface FilterSectionProps {
  label: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function FilterSection({ label, children, style }: FilterSectionProps) {
  return (
    <View style={[styles.filterSection, style]}>
      <ThemedText type="smallBold" themeColor="textSecondary" style={styles.sectionLabel}>
        {label}
      </ThemedText>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  filterSection: {
    gap: Spacing.one,
  },
  sectionLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
  },
});
