import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { ThemedText } from './themed-text';

interface StatMetrics {
    total: number;
    upcoming: number;
    live: number;
    past: number;
}

interface StatsBarProps {
    globalStats: StatMetrics;
    filteredStats: StatMetrics;
}

export function StatsBar({ globalStats, filteredStats }: StatsBarProps) {
    const theme = useTheme();

    return (
        <View style={styles.statsRow}>
            <View style={styles.statItem}>
                <ThemedText style={styles.statValue}>
                    {filteredStats.total}
                    <ThemedText style={[styles.statTotal, { color: theme.textSecondary }]}>/{globalStats.total}</ThemedText>
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary" style={styles.statLabel}>Total</ThemedText>
            </View>
            <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
            <View style={styles.statItem}>
                <ThemedText style={[styles.statValue, { color: '#0EA5E9' }]}>
                    {filteredStats.upcoming}
                    <ThemedText style={[styles.statTotal, { color: theme.textSecondary }]}>/{globalStats.upcoming}</ThemedText>
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary" style={styles.statLabel}>Upcoming</ThemedText>
            </View>
            <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
            <View style={styles.statItem}>
                <ThemedText style={[styles.statValue, { color: '#22C55E' }]}>
                    {filteredStats.live}
                    <ThemedText style={[styles.statTotal, { color: theme.textSecondary }]}>/{globalStats.live}</ThemedText>
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary" style={styles.statLabel}>Live</ThemedText>
            </View>
            <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
            <View style={styles.statItem}>
                <ThemedText style={[styles.statValue, { color: '#94A3B8' }]}>
                    {filteredStats.past}
                    <ThemedText style={[styles.statTotal, { color: theme.textSecondary }]}>/{globalStats.past}</ThemedText>
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary" style={styles.statLabel}>Past</ThemedText>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: Spacing.two,
        marginHorizontal: Spacing.four,
        marginTop: Spacing.two,
        marginBottom: Spacing.three,
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statValue: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    statTotal: {
        fontSize: 12,
        fontWeight: 'normal',
    },
    statLabel: {
        fontSize: 10,
        marginTop: 2,
        textTransform: 'uppercase',
    },
    statDivider: {
        width: 1,
        height: 24,
    },
});
