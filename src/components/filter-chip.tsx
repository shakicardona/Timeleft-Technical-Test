import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface FilterChipProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
}

export function FilterChip({ label, isSelected, onPress }: FilterChipProps) {
  const theme = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        styles.chip,
        { borderColor: theme.border },
        isSelected && { backgroundColor: theme.primary, borderColor: theme.primary }
      ]}
    >
      <Text style={[styles.chipText, { color: isSelected ? '#FFFFFF' : theme.text }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
