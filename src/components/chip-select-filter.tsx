import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { FilterChip } from './filter-chip';
import { FilterSection } from './filter-section';

export interface SelectOption<T> {
  value: T;
  label: string;
}

export interface MultiSelectChipsProps<T> {
  label: string;
  options: readonly SelectOption<T>[];
  selectedValues: T[];
  onChange: (values: T[]) => void;
}

export function MultiSelectChips<T>({
  label,
  options,
  selectedValues,
  onChange,
}: MultiSelectChipsProps<T>) {
  const handlePress = (value: T) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((val) => val !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  return (
    <FilterSection label={label}>
      <View style={styles.chipRow}>
        {options.map((option) => {
          const isSelected = selectedValues.includes(option.value);
          return (
            <FilterChip
              key={String(option.value)}
              label={option.label}
              isSelected={isSelected}
              onPress={() => handlePress(option.value)}
            />
          );
        })}
      </View>
    </FilterSection>
  );
}

export interface SingleSelectChipsProps<T> {
  label: string;
  options: readonly SelectOption<T>[];
  selectedValue: T | null;
  onChange: (value: T | null) => void;
  allowClear?: boolean;
}

export function SingleSelectChips<T>({
  label,
  options,
  selectedValue,
  onChange,
  allowClear = true,
}: SingleSelectChipsProps<T>) {
  const handlePress = (value: T) => {
    if (selectedValue === value) {
      if (allowClear) {
        onChange(null);
      }
    } else {
      onChange(value);
    }
  };

  return (
    <FilterSection label={label}>
      <View style={styles.chipRow}>
        {options.map((option) => {
          const isSelected = selectedValue === option.value;
          return (
            <FilterChip
              key={String(option.value)}
              label={option.label}
              isSelected={isSelected}
              onPress={() => handlePress(option.value)}
            />
          );
        })}
      </View>
    </FilterSection>
  );
}

const styles = StyleSheet.create({
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
});
