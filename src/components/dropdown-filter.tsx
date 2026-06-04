import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, StyleProp, ViewStyle } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { ThemedText } from './themed-text';

export interface DropdownFilterProps<T> {
  label?: string;
  options: T[];
  selectedOption: T | null;
  onSelectOption: (option: T | null) => void;
  getOptionLabel?: (option: T) => string;
  placeholder?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

export function DropdownFilter<T>({
  label,
  options,
  selectedOption,
  onSelectOption,
  getOptionLabel = (opt) => String(opt),
  placeholder = 'Select option',
  containerStyle,
}: DropdownFilterProps<T>) {
  const theme = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={[styles.filterSection, { zIndex: 10 }, containerStyle]}>
      {label && (
        <ThemedText type="smallBold" themeColor="textSecondary" style={styles.sectionLabel}>
          {label}
        </ThemedText>
      )}

      {/* Dropdown Trigger */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setIsOpen((prev) => !prev)}
        style={[styles.dropdownTrigger, { borderColor: theme.border, backgroundColor: theme.background }]}
      >
        <ThemedText style={{ fontWeight: '500' }}>
          {selectedOption ? getOptionLabel(selectedOption) : placeholder}
        </ThemedText>
        <ThemedText themeColor="textSecondary" style={styles.dropdownChevron}>
          {isOpen ? '▲' : '▼'}
        </ThemedText>
      </TouchableOpacity>

      {/* Dropdown Options */}
      {isOpen && (
        <View style={[styles.dropdownOptions, { borderColor: theme.border, backgroundColor: theme.backgroundElement, zIndex: 100 }]}>
          {/* "All" / Reset Option */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              onSelectOption(null);
              setIsOpen(false);
            }}
            style={[
              styles.dropdownOption,
              selectedOption === null && { backgroundColor: theme.primary + '10' }
            ]}
          >
            <ThemedText
              themeColor={selectedOption === null ? 'primary' : 'text'}
              style={[styles.optionText, selectedOption === null && { fontWeight: 'bold' }]}
            >
              {placeholder}
            </ThemedText>
            {selectedOption === null && <ThemedText themeColor="primary" style={styles.checkMark}>✓</ThemedText>}
          </TouchableOpacity>

          {/* Option List */}
          {options.map((option, index) => {
            const isSelected = selectedOption !== null && 
              (typeof option === 'string' && typeof selectedOption === 'string'
                ? option.toLowerCase() === selectedOption.toLowerCase()
                : option === selectedOption);
            
            return (
              <TouchableOpacity
                key={index}
                activeOpacity={0.7}
                onPress={() => {
                  onSelectOption(option);
                  setIsOpen(false);
                }}
                style={[
                  styles.dropdownOption,
                  isSelected && { backgroundColor: theme.primary + '10' }
                ]}
              >
                <ThemedText
                  themeColor={isSelected ? 'primary' : 'text'}
                  style={[styles.optionText, isSelected && { fontWeight: 'bold' }]}
                >
                  {getOptionLabel(option)}
                </ThemedText>
                {isSelected && <ThemedText themeColor="primary" style={styles.checkMark}>✓</ThemedText>}
              </TouchableOpacity>
            );
          })}
        </View>
      )}
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
  dropdownTrigger: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    height: 44,
    borderRadius: Spacing.two,
    borderWidth: 1,
    marginTop: Spacing.one,
  },
  dropdownChevron: {
    fontSize: 12,
  },
  dropdownOptions: {
    position: 'absolute',
    top: 76,
    left: 0,
    right: 0,
    borderWidth: 1,
    borderRadius: Spacing.two,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  dropdownOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(100, 116, 139, 0.1)',
  },
  optionText: {
    fontSize: 14,
  },
  checkMark: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
