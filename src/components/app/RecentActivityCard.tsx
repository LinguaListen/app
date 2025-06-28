import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { getTheme } from '../../constants/theme';

interface RecentActivityCardProps {
    item: {
        id: string;
        phrase: string;
        translation: string;
        timestamp: string;
    };
}

const RecentActivityCard = ({ item }: RecentActivityCardProps) => {
    const { isDark } = useTheme();
    const theme = getTheme(isDark);

    return (
        <TouchableOpacity style={[styles.card, { backgroundColor: theme.COLORS.lightGray }]}>
            <View style={[styles.iconContainer, { backgroundColor: `${theme.COLORS.primary}20` }]}>
                <Feather name="headphones" size={24} color={theme.COLORS.primary} />
            </View>
            <View style={styles.textContainer}>
                <Text style={[styles.phraseText, { color: theme.COLORS.textPrimary }]}>{item.phrase}</Text>
                <Text style={[styles.translationText, { color: theme.COLORS.textSecondary }]}>{item.translation}</Text>
            </View>
            <Text style={[styles.timestampText, { color: theme.COLORS.textSecondary }]}>{item.timestamp}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    iconContainer: {
        borderRadius: 50,
        padding: 12,
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
    },
    phraseText: {
        fontSize: 14,
        fontFamily: 'Inter-Medium',
        lineHeight: 20,
    },
    translationText: {
        fontSize: 13,
        fontFamily: 'Inter-Regular',
        lineHeight: 18,
        marginTop: 4,
    },
    timestampText: {
        fontSize: 12,
        fontFamily: 'Inter-Regular',
        lineHeight: 16,
        marginLeft: 8,
    },
});

export default RecentActivityCard; 