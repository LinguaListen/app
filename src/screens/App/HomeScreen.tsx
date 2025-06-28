import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Button } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { HomeScreenNavigationProp, AppTabParamList } from '../../types/navigation';
import { useTheme } from '../../context/ThemeContext';
import { getTheme } from '../../constants/theme';
import StyledTextInput from '../../components/common/StyledTextInput';
import StyledButton from '../../components/common/StyledButton';
import RecentActivityCard from '../../components/app/RecentActivityCard';
import EmptyState from '../../components/common/EmptyState';
import { useRecentActivity, RecentActivityItem } from '../../utils/recentActivity';

type HomeScreenRouteProp = RouteProp<AppTabParamList, 'Home'>;

function timeAgo(timestamp: number): string {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return days === 1 ? 'Yesterday' : `${days} days ago`;
}

const HomeScreen = () => {
    const navigation = useNavigation<HomeScreenNavigationProp>();
    const route = useRoute<HomeScreenRouteProp>();
    const { isDark } = useTheme();
    const theme = getTheme(isDark);
    const [code, setCode] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const { activities: recentActivity, refresh: refreshRecent, removeItem } = useRecentActivity();
    const [permission, requestPermission] = useCameraPermissions();

    // Refresh when route param provides new scan
    useEffect(() => {
        if (route.params?.scannedData) {
            setCode(route.params.scannedData);
        }
    }, [route.params?.scannedData]);

    // Refresh list every time Home screen gains focus
    useFocusEffect(
        React.useCallback(() => {
            refreshRecent();
        }, [refreshRecent])
    );

    const handleCodeSubmit = () => {
        if (code) {
            navigation.navigate('ContentDisplay', { code: code.trim() });
            setCode('');
        }
    };

    const handleQrScanPress = async () => {
        if (!permission?.granted) {
            const { status } = await requestPermission();
            if (status === 'granted') {
                setIsScanning(true);
            }
        } else {
            setIsScanning(true);
        }
    };

    const handleBarCodeScanned = ({ data }: { data: string }) => {
        setCode(data);
        setIsScanning(false);
    };

    if (isScanning) {
        return (
            <View style={styles.container}>
                <CameraView
                    style={StyleSheet.absoluteFillObject}
                    onBarcodeScanned={handleBarCodeScanned}
                    barcodeScannerSettings={{
                        barcodeTypes: ["qr"],
                    }}
                />
                <View style={styles.scannerOverlay}>
                    <Text style={styles.scannerText}>Scan a QR Code</Text>
                    <Button title="Cancel" onPress={() => setIsScanning(false)} color={theme.COLORS.primary} />
                </View>
            </View>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.COLORS.background }]}>
            <ScrollView showsVerticalScrollIndicator={false} style={{ paddingBottom: 20 }}>
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={[styles.welcomeText, { color: theme.COLORS.textSecondary }]}>Hello,</Text>
                        <Text style={[styles.userName, { color: theme.COLORS.textPrimary }]}>Adeola</Text>
                    </View>
                    <TouchableOpacity style={styles.notificationButton}>
                        <Feather name="bell" size={24} color={theme.COLORS.textPrimary} />
                    </TouchableOpacity>
                </View>

                {/* Code Entry Card */}
                <View style={[styles.card, { backgroundColor: theme.COLORS.lightGray }]}>
                    <Text style={[styles.cardTitle, { color: theme.COLORS.textPrimary }]}>Enter Flashcard Code</Text>
                    <StyledTextInput
                        placeholder="e.g., A1B2-C3D4"
                        value={code}
                        onChangeText={setCode}
                        autoCapitalize="characters"
                    />
                    <View style={{ height: 16 }} />
                    <StyledButton title="Get Audio" onPress={handleCodeSubmit} />
                    <TouchableOpacity style={styles.qrButton} onPress={handleQrScanPress}>
                        <Feather name="camera" size={20} color={theme.COLORS.primary} />
                        <Text style={[styles.qrButtonText, { color: theme.COLORS.primary }]}>Scan QR Code</Text>
                    </TouchableOpacity>
                </View>

                {/* Recent Activity */}
                <View style={styles.recentSection}>
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, { color: theme.COLORS.textPrimary }]}>Recent Activity</Text>
                        {/* <CustomSwitch
                            value={showDummyData}
                            onValueChange={setShowDummyData}
                        /> */}
                    </View>

                    {recentActivity && recentActivity.length > 0 ? (
                        recentActivity.map((item: RecentActivityItem) => {
                            const cardItem = {
                                id: item.id,
                                code: item.code,
                                phrase: item.phrase,
                                translation: item.translation,
                                timestamp: timeAgo(item.timestamp),
                            };
                            return (
                                <RecentActivityCard
                                    key={item.id}
                                    item={cardItem}
                                    onDelete={() => removeItem(item.id)}
                                />
                            );
                        })
                    ) : (
                        <EmptyState icon="clock" message="Your recent activity will appear here." />
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
    },
    welcomeText: {
        fontSize: 14,
        fontFamily: 'Inter-Regular',
        lineHeight: 20,
    },
    userName: {
        fontSize: 22,
        fontFamily: 'Nunito-SemiBold',
        lineHeight: 30,
    },
    notificationButton: {
        padding: 10,
    },
    card: {
        borderRadius: 18,
        padding: 20,
        margin: 20,
    },
    cardTitle: {
        fontSize: 18,
        fontFamily: 'Nunito-SemiBold',
        lineHeight: 22,
        marginBottom: 20,
        textAlign: 'center',
    },
    qrButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    qrButtonText: {
        fontSize: 13,
        fontFamily: 'Inter-Medium',
        lineHeight: 18,
        marginLeft: 8,
    },
    recentSection: {
        paddingHorizontal: 20,
        marginTop: 10,
        paddingBottom: 40,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: 'Nunito-SemiBold',
        lineHeight: 22,
    },
    scannerOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    scannerText: {
        fontSize: 22,
        fontFamily: 'Nunito-SemiBold',
        lineHeight: 30,
        color: 'white',
        marginBottom: 20,
    },
});

export default HomeScreen;