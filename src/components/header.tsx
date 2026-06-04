import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { ThemedText } from './themed-text';

interface HeaderProps {
    title: string;
}

export function Header({ title }: HeaderProps) {
    return (
        <View style={styles.container}>
            <ThemedText type="subtitle" style={styles.title}>
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
});
