import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import StyledButton from '../../components/common/StyledButton';
import { useOnboarding } from '../../context/OnboardingContext';
import { useTheme } from '../../context/ThemeContext';
import { getTheme } from '../../constants/theme';

const OnboardingScreen = () => {
    const { completeOnboarding } = useOnboarding();
    const [loading, setLoading] = useState(false);
    const { isDark } = useTheme();
    const theme = getTheme(isDark);

    const handlePress = async () => {
        if (loading) return;
        setLoading(true);
        await completeOnboarding();
    };

    const features = [
        {
            icon: 'qr-code-outline',
            title: 'Scan Flashcards',
            description: 'Scan QR codes or enter alphanumeric codes to access audio content instantly.'
        },
        {
            icon: 'library-outline',
            title: 'Browse Categories',
            description: 'Explore organized content by categories like greetings, questions, and more.'
        },
        {
            icon: 'cloud-offline-outline',
            title: 'Offline Access',
            description: 'Download content for offline listening when you\'re not connected.'
        }
    ];

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.COLORS.background }]}>
            <View style={styles.header}>
                <View style={[styles.logoContainer, { backgroundColor: theme.COLORS.primary }]}>
                    <Ionicons name="headset" size={40} color="#FFFFFF" />
                </View>
                <Text style={[styles.title, { color: theme.COLORS.textPrimary }]}>
                    Welcome to LinguaListen
                </Text>
                <Text style={[styles.subtitle, { color: theme.COLORS.textSecondary }]}>
                    Your interactive language learning companion
                </Text>
            </View>

            <View style={styles.features}>
                {features.map((feature, index) => (
                    <View key={index} style={styles.featureItem}>
                        <View style={[styles.iconContainer, { backgroundColor: theme.COLORS.lightGray }]}>
                            <Ionicons
                                name={feature.icon as any}
                                size={24}
                                color={theme.COLORS.primary}
                            />
                        </View>
                        <View style={styles.featureText}>
                            <Text style={[styles.featureTitle, { color: theme.COLORS.textPrimary }]}>
                                {feature.title}
                            </Text>
                            <Text style={[styles.featureDescription, { color: theme.COLORS.textSecondary }]}>
                                {feature.description}
                            </Text>
                        </View>
                    </View>
                ))}
            </View>

            <View style={styles.footer}>
                <StyledButton
                    title="Get Started"
                    onPress={handlePress}
                    loading={loading}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        alignItems: 'center',
        paddingHorizontal: 32,
        paddingTop: 60,
        paddingBottom: 40,
    },
    logoContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 28,
        fontFamily: 'Nunito-Bold',
        lineHeight: 34,
        textAlign: 'center',
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 16,
        fontFamily: 'Inter-Regular',
        lineHeight: 22,
        textAlign: 'center',
        opacity: 0.8,
    },
    features: {
        flex: 1,
        paddingHorizontal: 32,
        paddingVertical: 20,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 32,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    featureText: {
        flex: 1,
        paddingTop: 2,
    },
    featureTitle: {
        fontSize: 16,
        fontFamily: 'Inter-Medium',
        lineHeight: 22,
        marginBottom: 4,
    },
    featureDescription: {
        fontSize: 14,
        fontFamily: 'Inter-Regular',
        lineHeight: 20,
        opacity: 0.8,
    },
    footer: {
        paddingHorizontal: 32,
        paddingBottom: 40,
    },
});

export default OnboardingScreen; 