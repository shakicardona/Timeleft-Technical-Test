// src/components/event-card.tsx
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme'; // Import useTheme hook
import { Event } from '@/types/event';
import { formatEventDate, getEventAvailability } from '@/utils/formatters';
import { AvailabilityBadge } from './availability-badge';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

interface EventCardProps {
    event: Event;
}

export function EventCard({ event }: EventCardProps) {
    const router = useRouter();
    const theme = useTheme(); // Access active theme colors
    const availability = getEventAvailability(event.booked, event.capacity);

    const handlePress = () => {
        router.push(`/event/${event.id}`);
    };

    return (
        <TouchableOpacity onPress={handlePress}>
            <ThemedView type="backgroundElement" style={[styles.card, { borderColor: theme.border }]}>

                {/* Top Header Row */}
                <View style={styles.topRow}>
                    <ThemedText
                        type="smallBold"
                        style={[styles.cardCity, { color: theme.primary }]}
                    >
                        {event.zone.city.name} • {event.zone.name}
                    </ThemedText>
                    {/* Color-coded Availability Badge */}
                    <AvailabilityBadge color={availability.color} label={availability.label} />
                </View>

                {/* Event Type & Date */}
                <ThemedText type="default" style={styles.eventType}>
                    {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary" style={styles.eventDate}>
                    {formatEventDate(event.date)}
                </ThemedText>
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
    eventType: {
        fontWeight: '600',
    },
    eventDate: {
        marginTop: Spacing.one,
    },
});
