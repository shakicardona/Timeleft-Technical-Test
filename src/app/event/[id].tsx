import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AvailabilityBadge } from '@/components/availability-badge';
import { Header } from '@/components/header';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { getEvents } from '@/api/eventsApi';
import { Event } from '@/types/event';
import { formatEventDate, getEventAvailability } from '@/utils/formatters';

export default function EventDetailsScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const theme = useTheme();

    const [event, setEvent] = useState<Event | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;
        async function fetchEventDetails() {
            try {
                setIsLoading(true);
                setError(null);
                const allEvents = await getEvents();
                const matchedEvent = allEvents.find(e => e.id.toString() === id);
                if (isMounted) {
                    if (matchedEvent) {
                        setEvent(matchedEvent);
                    } else {
                        setError('Event not found.');
                    }
                }
            } catch (err: any) {
                if (isMounted) {
                    setError(err.message || 'Failed to load event details.');
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        if (id) {
            fetchEventDetails();
        } else {
            setIsLoading(false);
            setError('No event ID provided.');
        }

        return () => {
            isMounted = false;
        };
    }, [id]);

    const availability = event ? getEventAvailability(event.booked, event.capacity) : null;

    if (isLoading) {
        return (
            <ThemedView style={styles.centerContainer}>
                <ActivityIndicator size="large" color={theme.primary} />
                <ThemedText style={{ marginTop: Spacing.three }}>Loading event details...</ThemedText>
            </ThemedView>
        );
    }

    if (error || !event || !availability) {
        return (
            <ThemedView style={styles.centerContainer}>
                <ThemedText type="subtitle" style={{ color: theme.error, marginBottom: Spacing.two }}>Error</ThemedText>
                <ThemedText style={{ marginBottom: Spacing.four, textAlign: 'center' }}>
                    {error || 'Could not load event.'}
                </ThemedText>
                <TouchableOpacity
                    style={[styles.btnBack, { backgroundColor: theme.primary }]}
                    onPress={() => router.back()}
                >
                    <Text style={styles.btnBackText}>Go Back</Text>
                </TouchableOpacity>
            </ThemedView>
        );
    }

    // CTA Button states
    let ctaText = 'Book Now';
    let ctaDisabled = false;

    if (event.status === 'past') {
        ctaText = 'Event Finished';
        ctaDisabled = true;
    } else if (event.status === 'live') {
        ctaText = 'Event in Progress';
        ctaDisabled = true;
    } else if (availability.status === 'sold-out') {
        ctaText = 'Sold Out';
        ctaDisabled = true;
    }

    return (
        <ThemedView style={styles.container}>
            <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>

                <Header title="Event Details" showBackButton={true} titleType="default" />

                <View style={styles.contentContainer}>
                    {/* Event Banner Card */}
                    <ThemedView type="backgroundElement" style={[styles.mainCard, { borderColor: theme.border }]}>
                        {/* City & Zone */}
                        <ThemedText type="smallBold" style={[styles.cityText, { color: theme.primary }]}>
                            {event.zone.city.name} • {event.zone.name}
                        </ThemedText>

                        {/* Title (Event Type) */}
                        <ThemedText type="subtitle" style={styles.titleText}>
                            {event.type.charAt(0).toUpperCase() + event.type.slice(1)} Night
                        </ThemedText>

                        <View style={styles.divider} />

                        {/* Date & Time info */}
                        <View style={styles.infoRow}>
                            <ThemedText themeColor="textSecondary" style={styles.infoLabel}>Date & Time</ThemedText>
                            <ThemedText type="default" style={styles.infoValue}>
                                {formatEventDate(event.date)}
                            </ThemedText>
                        </View>

                        {/* Location / Country */}
                        <View style={styles.infoRow}>
                            <ThemedText themeColor="textSecondary" style={styles.infoLabel}>Country</ThemedText>
                            <ThemedText type="default" style={styles.infoValue}>
                                {event.zone.city.country.name}
                            </ThemedText>
                        </View>

                        {/* Event Status */}
                        <View style={styles.infoRow}>
                            <ThemedText themeColor="textSecondary" style={styles.infoLabel}>Status</ThemedText>
                            <View style={[styles.statusBadge, { backgroundColor: event.status === 'upcoming' ? '#38A16915' : event.status === 'live' ? '#DD6B2015' : '#71809615' }]}>
                                <Text style={[styles.statusText, { color: event.status === 'upcoming' ? '#38A169' : event.status === 'live' ? '#DD6B20' : '#718096' }]}>
                                    {event.status.toUpperCase()}
                                </Text>
                            </View>
                        </View>
                    </ThemedView>

                    {/* Booking & Capacity Gauge */}
                    <ThemedView type="backgroundElement" style={[styles.mainCard, { borderColor: theme.border, marginTop: Spacing.three }]}>
                        <View style={styles.capacityHeader}>
                            <ThemedText type="default" style={{ fontWeight: 'bold' }}>
                                Availability
                            </ThemedText>
                            <AvailabilityBadge color={availability.color} label={availability.label} />
                        </View>

                        {/* Progress Bar */}
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
                                {event.booked} out of {event.capacity} seats booked ({availability.percentage}%)
                            </ThemedText>
                        </View>
                    </ThemedView>
                </View>

                {/* Footer Booking CTA */}
                <ThemedView type="backgroundElement" style={[styles.footer, { borderTopColor: theme.border }]}>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        disabled={ctaDisabled}
                        style={[
                            styles.ctaButton,
                            { backgroundColor: ctaDisabled ? theme.border : theme.primary }
                        ]}
                        onPress={() => {
                            Alert.alert('Booking registered', `Booking registered for the ${event.type} event in ${event.zone.city.name}!`);
                        }}
                    >
                        <Text style={[styles.ctaButtonText, { color: ctaDisabled ? theme.textSecondary : '#FFFFFF' }]}>
                            {ctaText}
                        </Text>
                    </TouchableOpacity>
                </ThemedView>
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
    btnBack: {
        paddingHorizontal: Spacing.four,
        paddingVertical: Spacing.two,
        borderRadius: Spacing.two,
    },
    btnBackText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 14,
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: Spacing.four,
        paddingTop: Spacing.two,
        paddingBottom: Spacing.six,
    },
    mainCard: {
        padding: Spacing.four,
        borderRadius: Spacing.two,
        borderWidth: 1,
    },
    cityText: {
        textTransform: 'uppercase',
        marginBottom: Spacing.one,
    },
    titleText: {
        fontWeight: 'bold',
        fontSize: 24,
        lineHeight: 32,
        marginBottom: Spacing.three,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(100, 116, 139, 0.1)',
        marginVertical: Spacing.three,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: Spacing.two,
    },
    infoLabel: {
        fontSize: 14,
    },
    infoValue: {
        fontWeight: '600',
    },
    statusBadge: {
        paddingHorizontal: Spacing.two,
        paddingVertical: 4,
        borderRadius: 6,
    },
    statusText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    capacityHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.three,
    },
    progressContainer: {
        gap: Spacing.two,
    },
    progressBarBg: {
        height: 8,
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 4,
    },
    footer: {
        padding: Spacing.four,
        borderTopWidth: 1,
    },
    ctaButton: {
        height: 48,
        borderRadius: Spacing.two,
        justifyContent: 'center',
        alignItems: 'center',
    },
    ctaButtonText: {
        fontWeight: 'bold',
        fontSize: 16,
    },
});
