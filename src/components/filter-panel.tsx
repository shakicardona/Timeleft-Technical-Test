import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { SortOption } from '@/hooks/useEvents';
import { EventStatus, EventType } from '@/types/event';
import { DropdownFilter } from './dropdown-filter';
import { MultiSelectChips, SingleSelectChips, SelectOption } from './chip-select-filter';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

interface FilterPanelProps {
    visible: boolean;
    uniqueCities: string[];
    selectedCity: string | null;
    setSelectedCity: (city: string | null) => void;
    uniqueTypes: EventType[];
    selectedType: EventType | null;
    setSelectedType: (type: EventType | null) => void;
    selectedStatuses: EventStatus[];
    setSelectedStatuses: (statuses: EventStatus[]) => void;
    sortBy: SortOption;
    setSortBy: (opt: SortOption) => void;
    resetFilters: () => void;
}

const STATUS_OPTIONS: SelectOption<EventStatus>[] = [
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'live', label: 'Live' },
    { value: 'past', label: 'Past' }
];

const SORT_OPTIONS: SelectOption<SortOption>[] = [
    { value: 'date-asc', label: 'Date' },
    { value: 'popularity', label: 'Popularity' },
    { value: 'seats-left', label: 'Availability' }
];

export function FilterPanel({
    visible,
    uniqueCities,
    selectedCity,
    setSelectedCity,
    uniqueTypes,
    selectedType,
    setSelectedType,
    selectedStatuses,
    setSelectedStatuses,
    sortBy,
    setSortBy,
    resetFilters
}: FilterPanelProps) {
    const theme = useTheme();

    if (!visible) return null;

    const typeOptions = uniqueTypes.map(type => ({
        value: type,
        label: type.charAt(0).toUpperCase() + type.slice(1)
    }));

    return (
        <ThemedView type="backgroundElement" style={[styles.filtersContainer, { borderColor: theme.border }]}>
            {/* City Filters */}
            {uniqueCities.length > 0 && (
                <DropdownFilter
                    label="City"
                    options={uniqueCities}
                    selectedOption={selectedCity}
                    onSelectOption={setSelectedCity}
                    placeholder="All Cities"
                />
            )}

            {/* Status Filters */}
            <MultiSelectChips
                label="Status"
                options={STATUS_OPTIONS}
                selectedValues={selectedStatuses}
                onChange={setSelectedStatuses}
            />

            {/* Type Filters */}
            {uniqueTypes.length > 0 && (
                <SingleSelectChips
                    label="Type"
                    options={typeOptions}
                    selectedValue={selectedType}
                    onChange={setSelectedType}
                />
            )}

            {/* Sort Options */}
            <SingleSelectChips
                label="Sort By"
                options={SORT_OPTIONS}
                selectedValue={sortBy}
                onChange={(val) => {
                    if (val) setSortBy(val);
                }}
                allowClear={false}
            />

            {/* Reset Button */}
            <TouchableOpacity onPress={resetFilters} style={styles.resetBtn}>
                <ThemedText themeColor="error" style={styles.resetBtnText}>
                    Clear All Filters
                </ThemedText>
            </TouchableOpacity>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    filtersContainer: {
        position: 'absolute',
        top: 8,
        left: 0,
        right: 0,
        zIndex: 999,
        padding: Spacing.three,
        borderRadius: Spacing.two,
        borderWidth: 1,
        gap: Spacing.three,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 6,
    },
    resetBtn: {
        alignSelf: 'flex-start',
        paddingVertical: Spacing.one,
    },
    resetBtnText: {
        fontWeight: 'bold',
        fontSize: 13,
    },
});
