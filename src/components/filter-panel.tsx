import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { SortOption } from '@/hooks/useEvents';
import { EventStatus, EventType } from '@/types/event';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

interface FilterPanelProps {
    visible: boolean;
    uniqueCities: string[];
    selectedCity: string | null;
    setSelectedCity: (city: string | null) => void;
    uniqueTypes: string[];
    selectedType: EventType | null;
    setSelectedType: (type: EventType | null) => void;
    selectedStatuses: EventStatus[];
    setSelectedStatuses: (statuses: EventStatus[]) => void;
    sortBy: SortOption;
    setSortBy: (opt: SortOption) => void;
    resetFilters: () => void;
}

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
    const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);

    if (!visible) return null;

    return (
        <ThemedView type="backgroundElement" style={[styles.filtersContainer, { borderColor: theme.border }]}>
            {/* City Filters */}
            {uniqueCities.length > 0 && (
                <View style={[styles.filterSection, { zIndex: 10 }]}>
                    <ThemedText type="smallBold" themeColor="textSecondary" style={styles.sectionLabel}>
                        City
                    </ThemedText>

                    {/* Dropdown Trigger */}
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => setIsCityDropdownOpen(prev => !prev)}
                        style={[styles.dropdownTrigger, { borderColor: theme.border, backgroundColor: theme.background }]}
                    >
                        <ThemedText style={{ fontWeight: '500' }}>
                            {selectedCity ? selectedCity : 'All Cities'}
                        </ThemedText>
                        <ThemedText themeColor="textSecondary" style={styles.dropdownChevron}>
                            {isCityDropdownOpen ? '▲' : '▼'}
                        </ThemedText>
                    </TouchableOpacity>

                    {/* Dropdown Options */}
                    {isCityDropdownOpen && (
                        <View style={[styles.dropdownOptions, { borderColor: theme.border, backgroundColor: theme.backgroundElement, zIndex: 100 }]}>
                            {/* "All" Option */}
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={() => {
                                    setSelectedCity(null);
                                    setIsCityDropdownOpen(false);
                                }}
                                style={[
                                    styles.dropdownOption,
                                    !selectedCity && { backgroundColor: theme.primary + '10' }
                                ]}
                            >
                                <ThemedText
                                    themeColor={!selectedCity ? 'primary' : 'text'}
                                    style={[styles.optionText, !selectedCity && { fontWeight: 'bold' }]}
                                >
                                    All Cities
                                </ThemedText>
                                {!selectedCity && <ThemedText themeColor="primary" style={styles.checkMark}>✓</ThemedText>}
                            </TouchableOpacity>

                            {/* City Options */}
                            {uniqueCities.map((city) => {
                                const isSelected = selectedCity?.toLowerCase() === city.toLowerCase();
                                return (
                                    <TouchableOpacity
                                        key={city}
                                        activeOpacity={0.7}
                                        onPress={() => {
                                            setSelectedCity(city);
                                            setIsCityDropdownOpen(false);
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
                                            {city}
                                        </ThemedText>
                                        {isSelected && <ThemedText themeColor="primary" style={styles.checkMark}>✓</ThemedText>}
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    )}
                </View>
            )}

            {/* Status Filters */}
            <View style={styles.filterSection}>
                <ThemedText type="smallBold" themeColor="textSecondary" style={styles.sectionLabel}>
                    Status
                </ThemedText>
                <View style={styles.chipRow}>
                    {(['upcoming', 'live', 'past'] as const).map((status) => {
                        const isSelected = selectedStatuses.includes(status);
                        return (
                            <TouchableOpacity
                                key={status}
                                onPress={() => {
                                    if (isSelected) {
                                        setSelectedStatuses(selectedStatuses.filter((s) => s !== status));
                                    } else {
                                        setSelectedStatuses([...selectedStatuses, status]);
                                    }
                                }}
                                style={[
                                    styles.chip,
                                    { borderColor: theme.border },
                                    isSelected && { backgroundColor: theme.primary, borderColor: theme.primary }
                                ]}
                            >
                                <Text style={[styles.chipText, { color: isSelected ? '#FFFFFF' : theme.text }]}>
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>

            {/* Type Filters */}
            {uniqueTypes.length > 0 && (
                <View style={styles.filterSection}>
                    <ThemedText type="smallBold" themeColor="textSecondary" style={styles.sectionLabel}>
                        Type
                    </ThemedText>
                    <View style={styles.chipRow}>
                        {uniqueTypes.map((type) => {
                            const isSelected = selectedType === type;
                            return (
                                <TouchableOpacity
                                    key={type}
                                    onPress={() => setSelectedType(isSelected ? null : type)}
                                    style={[
                                        styles.chip,
                                        { borderColor: theme.border },
                                        isSelected && { backgroundColor: theme.primary, borderColor: theme.primary }
                                    ]}
                                >
                                    <Text style={[styles.chipText, { color: isSelected ? '#FFFFFF' : theme.text }]}>
                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>
            )}

            {/* Sort Options */}
            <View style={styles.filterSection}>
                <ThemedText type="smallBold" themeColor="textSecondary" style={styles.sectionLabel}>
                    Sort By
                </ThemedText>
                <View style={styles.chipRow}>
                    {([
                        { value: 'date-asc', label: 'Date' },
                        { value: 'popularity', label: 'Popularity' },
                        { value: 'seats-left', label: 'Availability' }
                    ] as const).map((opt) => {
                        const isSelected = sortBy === opt.value;
                        return (
                            <TouchableOpacity
                                key={opt.value}
                                onPress={() => setSortBy(opt.value)}
                                style={[
                                    styles.chip,
                                    { borderColor: theme.border },
                                    isSelected && { backgroundColor: theme.primary, borderColor: theme.primary }
                                ]}
                            >
                                <Text style={[styles.chipText, { color: isSelected ? '#FFFFFF' : theme.text }]}>
                                    {opt.label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>

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
    chipRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.two,
    },
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
    resetBtn: {
        alignSelf: 'flex-start',
        paddingVertical: Spacing.one,
    },
    resetBtnText: {
        fontWeight: 'bold',
        fontSize: 13,
    },
});
