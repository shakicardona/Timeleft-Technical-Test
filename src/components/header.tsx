import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { ThemedText } from './themed-text';

interface HeaderProps {
    title: string;
    showBackButton?: boolean;
    onBackPress?: () => void;
    titleType?: 'default' | 'title' | 'small' | 'smallBold' | 'subtitle';
}

export function Header({
    title,
    showBackButton = false,
    onBackPress,
    titleType = 'subtitle',
}: HeaderProps) {
    const router = useRouter();
    const theme = useTheme();

    const handleBack = () => {
        if (onBackPress) {
            onBackPress();
        } else {
            router.back();
        }
    };

    if (showBackButton) {
        return (
            <View style={styles.rowContainer}>
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={handleBack}
                    style={styles.backButton}
                >
                    <ThemedText style={[styles.backArrow, { color: theme.primary }]}>←</ThemedText>
                    <ThemedText themeColor="primary" style={styles.backText}>Back</ThemedText>
                </TouchableOpacity>
                <ThemedText type={titleType} style={styles.headerTitle}>
                    {title}
                </ThemedText>
                <View style={styles.headerPlaceholder} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ThemedText type={titleType} style={styles.title}>
                {title}
            </ThemedText>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: Spacing.four,
        paddingVertical: Spacing.three,
    },
    title: {
        fontWeight: 'bold',
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.four,
        paddingVertical: Spacing.three,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backArrow: {
        fontSize: 20,
        fontWeight: 'bold',
        marginRight: Spacing.one,
    },
    backText: {
        fontSize: 16,
        fontWeight: '600',
    },
    headerTitle: {
        fontWeight: 'bold',
    },
    headerPlaceholder: {
        width: 50, // balances the back button layout
    },
});
