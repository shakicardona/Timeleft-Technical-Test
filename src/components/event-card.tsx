// src/components/event-card.tsx
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme'; // Import useTheme hook
import { Event } from '@/types/event';
import { formatEventDate, getEventAvailability } from '@/utils/formatters';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

interface EventCardProps {
    event: Event;
}

export function EventCard({ event }: EventCardProps) {
    const router = useRouter();
    const theme = useTheme(); // Access active theme colors
    const availability = getEventAvailability(event.booked, event.capacity);

    /*const handlePress = () => {
        router.push(`/event/${event.id}`);
    };*/

    return (
        <TouchableOpacity onPress={() => { }}>
            <ThemedView type="backgroundElement" style={styles.card}>

                {/* Top Header Row */}
                <View style={styles.topRow}>
                    <ThemedText
                        type="smallBold"
                        style={[styles.cardCity, { color: theme.primary }]}
                    >
                        {event.zone.city.name} • {event.zone.name}
                    </ThemedText>
                    {/* Color-coded Availability Badge */}
                    <View style={[styles.badge, { backgroundColor: availability.color + '15' }]}>
                        <Text style={[styles.badgeText, { color: availability.color }]}>
                            {availability.label}
                        </Text>
                    </View>
                </View>

                {/* Event Type & Date */}
                <ThemedText type="default" style={styles.eventType}>
                    {event.type} Night
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary" style={styles.eventDate}>
                    {formatEventDate(event.date)}
                </ThemedText>

                {/* Capacity Progress Bar */}
                <View style={styles.progressContainer}>
                    <View style={[styles.progressBarBg, { backgroundColor: theme.border }]}>
                        <View
                            style={[
                                styles.progressBarFill,
                                { width: `${availability.percentage}%`, backgroundColor: availability.color }
                            ]}
                        />
                    </View>
                    <ThemedText type="small" themeColor="textSecondary">
                        {event.booked} / {event.capacity} booked ({availability.percentage}%)
                    </ThemedText>
                </View>
            </ThemedView>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        padding: Spacing.three,
        borderRadius: Spacing.two,
        marginBottom: Spacing.three,
        borderWidth: 1,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.two,
    },
    cardCity: {
        textTransform: 'uppercase',
        flex: 1,
        marginRight: Spacing.two,
    },
    badge: {
        paddingHorizontal: Spacing.two,
        paddingVertical: 4,
        borderRadius: 8,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    eventType: {
        fontWeight: '600',
    },
    eventDate: {
        marginTop: Spacing.one,
        marginBottom: Spacing.three,
    },
    progressContainer: {
        gap: Spacing.one,
    },
    progressBarBg: {
        height: 6,
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 3,
    },
});
