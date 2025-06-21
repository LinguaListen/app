import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { getTheme, theme } from '../../constants/theme';
import CustomSwitch from '../../components/common/CustomSwitch';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';

type ProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ProfileScreen = () => {
    const navigation = useNavigation<ProfileScreenNavigationProp>();
    const { logout } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const theme = getTheme(isDark);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [soundEnabled, setSoundEnabled] = useState(true);

    // Mock user data - in a real app, this would come from context/API
    const userData = {
        name: 'Adeola',
        email: 'adeolaibi@example.com',
        joinDate: 'January 2024',
        avatar: 'A', // First letter for avatar
    };

    // Mock learning statistics
    const learningStats = {
        totalPhrases: 47,
        completedLessons: 12,
        currentStreak: 5,
        totalStudyTime: '2h 34m',
    };

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Logout', style: 'destructive', onPress: logout },
            ]
        );
    };

    const handleEditProfile = () => {
        navigation.navigate('EditProfile');
    };

    const handleSupport = () => {
        navigation.navigate('HelpSupport');
    };

    const handlePrivacy = () => {
        navigation.navigate('PrivacyPolicy');
    };

    const StatCard = ({ icon, title, value, color = theme.COLORS.primary }: {
        icon: keyof typeof Feather.glyphMap;
        title: string;
        value: string;
        color?: string;
    }) => (
        <View style={[styles.statCard, { backgroundColor: theme.COLORS.lightGray, borderColor: theme.COLORS.border }]}>
            <View style={[styles.statIcon, { backgroundColor: `${color}20` }]}>
                <Feather name={icon} size={20} color={color} />
            </View>
            <Text style={[styles.statValue, { color: theme.COLORS.textPrimary }]}>{value}</Text>
            <Text style={[styles.statTitle, { color: theme.COLORS.textSecondary }]}>{title}</Text>
        </View>
    );

    const SettingItem = ({
        icon,
        title,
        subtitle,
        onPress,
        showArrow = true,
        rightComponent
    }: {
        icon: keyof typeof Feather.glyphMap;
        title: string;
        subtitle?: string;
        onPress?: () => void;
        showArrow?: boolean;
        rightComponent?: React.ReactNode;
    }) => {
        // If there's a rightComponent (like a Switch), don't make the whole item touchable
        if (rightComponent) {
            return (
                <View style={[styles.settingItem, { borderBottomColor: theme.COLORS.border }]}>
                    <View style={styles.settingLeft}>
                        <View style={[styles.settingIcon, { backgroundColor: theme.COLORS.background }]}>
                            <Feather name={icon} size={20} color={theme.COLORS.textSecondary} />
                        </View>
                        <View style={styles.settingContent}>
                            <Text style={[styles.settingTitle, { color: theme.COLORS.textPrimary }]}>{title}</Text>
                            {subtitle && <Text style={[styles.settingSubtitle, { color: theme.COLORS.textSecondary }]}>{subtitle}</Text>}
                        </View>
                    </View>
                    <View style={styles.settingRight}>
                        {rightComponent}
                    </View>
                </View>
            );
        }

        // For regular clickable items without rightComponent
        return (
            <TouchableOpacity style={[styles.settingItem, { borderBottomColor: theme.COLORS.border }]} onPress={onPress} disabled={!onPress}>
                <View style={styles.settingLeft}>
                    <View style={[styles.settingIcon, { backgroundColor: theme.COLORS.background }]}>
                        <Feather name={icon} size={20} color={theme.COLORS.textSecondary} />
                    </View>
                    <View style={styles.settingContent}>
                        <Text style={[styles.settingTitle, { color: theme.COLORS.textPrimary }]}>{title}</Text>
                        {subtitle && <Text style={[styles.settingSubtitle, { color: theme.COLORS.textSecondary }]}>{subtitle}</Text>}
                    </View>
                </View>
                <View style={styles.settingRight}>
                    {showArrow && (
                        <Feather name="chevron-right" size={20} color={theme.COLORS.textSecondary} />
                    )}
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.COLORS.background }]}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Profile Header */}
                <View style={[styles.profileHeader, { backgroundColor: theme.COLORS.background }]}>
                    <View style={[styles.avatarContainer, { backgroundColor: theme.COLORS.primary }]}>
                        <Text style={[styles.avatarText, { color: theme.COLORS.background }]}>{userData.avatar}</Text>
                    </View>
                    <View style={styles.profileInfo}>
                        <Text style={[styles.userName, { color: theme.COLORS.textPrimary }]}>{userData.name}</Text>
                        <Text style={[styles.userEmail, { color: theme.COLORS.textSecondary }]}>{userData.email}</Text>
                        <Text style={[styles.joinDate, { color: theme.COLORS.textSecondary }]}>Member since {userData.joinDate}</Text>
                    </View>
                    <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
                        <Feather name="edit-2" size={18} color={theme.COLORS.primary} />
                    </TouchableOpacity>
                </View>

                {/* Learning Statistics */}
                <View style={styles.statsSection}>
                    <Text style={[styles.sectionTitle, { color: theme.COLORS.textPrimary }]}>Learning Progress</Text>
                    <View style={styles.statsGrid}>
                        <StatCard
                            icon="book-open"
                            title="Phrases Learned"
                            value={learningStats.totalPhrases.toString()}
                            color={theme.COLORS.primary}
                        />
                        <StatCard
                            icon="award"
                            title="Lessons Completed"
                            value={learningStats.completedLessons.toString()}
                            color="#78B242"
                        />
                        <StatCard
                            icon="zap"
                            title="Current Streak"
                            value={`${learningStats.currentStreak} days`}
                            color="#F97316"
                        />
                        <StatCard
                            icon="clock"
                            title="Study Time"
                            value={learningStats.totalStudyTime}
                            color="#EF4444"
                        />
                    </View>
                </View>

                {/* Settings Section */}
                <View style={styles.settingsSection}>
                    <Text style={[styles.sectionTitle, { color: theme.COLORS.textPrimary }]}>Settings</Text>
                    <View style={[styles.settingsCard, { backgroundColor: theme.COLORS.lightGray, borderColor: theme.COLORS.border }]}>
                        <SettingItem
                            icon="bell"
                            title="Notifications"
                            subtitle="Get reminders to practice"
                            showArrow={false}
                            rightComponent={
                                <CustomSwitch
                                    value={notificationsEnabled}
                                    onValueChange={setNotificationsEnabled}
                                />
                            }
                        />
                        <SettingItem
                            icon="volume-2"
                            title="Sound Effects"
                            subtitle="Audio feedback and sounds"
                            showArrow={false}
                            rightComponent={
                                <CustomSwitch
                                    value={soundEnabled}
                                    onValueChange={setSoundEnabled}
                                />
                            }
                        />
                        <SettingItem
                            icon="moon"
                            title="Dark Mode"
                            subtitle="Switch to dark theme"
                            showArrow={false}
                            rightComponent={
                                <CustomSwitch
                                    value={isDark}
                                    onValueChange={toggleTheme}
                                />
                            }
                        />
                    </View>
                </View>

                {/* Support Section */}
                <View style={styles.supportSection}>
                    <Text style={[styles.sectionTitle, { color: theme.COLORS.textPrimary }]}>Support</Text>
                    <View style={[styles.settingsCard, { backgroundColor: theme.COLORS.lightGray, borderColor: theme.COLORS.border }]}>
                        <SettingItem
                            icon="help-circle"
                            title="Help & Support"
                            subtitle="Get help with the app"
                            onPress={handleSupport}
                        />
                        <SettingItem
                            icon="shield"
                            title="Privacy Policy"
                            subtitle="How we protect your data"
                            onPress={handlePrivacy}
                        />
                        <SettingItem
                            icon="info"
                            title="About"
                            subtitle="App version and info"
                            onPress={() => navigation.navigate('About')}
                        />
                    </View>
                </View>

                {/* Logout Button */}
                <View style={styles.logoutSection}>
                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <Text style={styles.logoutButtonText}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.COLORS.background,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 24,
        backgroundColor: theme.COLORS.background,
    },
    avatarContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: theme.COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    avatarText: {
        fontSize: 24,
        fontFamily: 'Inter-SemiBold',
        fontWeight: '600',
        color: theme.COLORS.background,
    },
    profileInfo: {
        flex: 1,
    },
    userName: {
        ...theme.FONTS.h3,
        color: theme.COLORS.textPrimary,
        fontFamily: 'Nunito-SemiBold',
        fontWeight: '600',
    },
    userEmail: {
        ...theme.FONTS.body3,
        color: theme.COLORS.textSecondary,
        marginTop: 2,
        height: 1.2,
    },
    joinDate: {
        ...theme.FONTS.body4,
        color: theme.COLORS.textSecondary,
        marginTop: 4,
        fontSize: 12,
        height: 1.2,
    },
    editButton: {
        padding: 8,
    },
    statsSection: {
        paddingHorizontal: 20,
        marginBottom: 32,
    },
    sectionTitle: {
        ...theme.FONTS.h3,
        color: theme.COLORS.textPrimary,
        fontFamily: 'Nunito-SemiBold',
        fontWeight: '600',
        fontSize: 18,
        marginBottom: 16,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 12,
    },
    statCard: {
        backgroundColor: theme.COLORS.lightGray,
        borderRadius: theme.SIZES.radius,
        padding: 16,
        alignItems: 'center',
        width: '48%',
        borderWidth: 1,
        borderColor: theme.COLORS.border,
    },
    statIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    statValue: {
        ...theme.FONTS.h4,
        color: theme.COLORS.textPrimary,
        fontFamily: 'Inter-SemiBold',
        fontWeight: '600',
        fontSize: 16,
        marginBottom: 4,
    },
    statTitle: {
        ...theme.FONTS.body4,
        color: theme.COLORS.textSecondary,
        textAlign: 'center',
        fontSize: 12,
        height: 1.2,
    },
    settingsSection: {
        paddingHorizontal: 20,
        marginBottom: 32,
    },
    supportSection: {
        paddingHorizontal: 20,
        marginBottom: 32,
    },
    settingsCard: {
        backgroundColor: theme.COLORS.lightGray,
        borderRadius: theme.SIZES.radius,
        borderWidth: 1,
        borderColor: theme.COLORS.border,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: theme.COLORS.border,
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    settingIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: theme.COLORS.background,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    settingContent: {
        flex: 1,
    },
    settingTitle: {
        ...theme.FONTS.body2,
        color: theme.COLORS.textPrimary,
        fontFamily: 'Inter-Medium',
        fontWeight: '500',
        fontSize: 16,
    },
    settingSubtitle: {
        ...theme.FONTS.body4,
        color: theme.COLORS.textSecondary,
        marginTop: 2,
        fontSize: 14,
        height: 1.2,
    },
    settingRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoutSection: {
        paddingHorizontal: 20,
        marginTop: 20,
    },
    logoutButton: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: '#EF4444',
        paddingVertical: 16,
        borderRadius: theme.SIZES.radius,
        alignItems: 'center',
        width: '100%',
    },
    logoutButtonText: {
        ...theme.FONTS.h4,
        color: '#EF4444',
        fontFamily: 'Inter-SemiBold',
        fontWeight: '600',
    },
});

export default ProfileScreen; 