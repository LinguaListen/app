import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { HomeScreenNavigationProp } from '../../types/navigation';
import { useTheme } from '../../context/ThemeContext';
import { getTheme } from '../../constants/theme';
import StyledTextInput from '../../components/common/StyledTextInput';
import EmptyState from '../../components/common/EmptyState';
import { useContent } from '../../services/contentService';
import { Phrase } from '../../types/phrase';
import { CATEGORIES, CategoryId } from '../../constants/categories';
import { useToast } from '../../context/ToastContext';

const BrowseScreen = () => {
    const navigation = useNavigation<HomeScreenNavigationProp>();
    const { isDark } = useTheme();
    const theme = getTheme(isDark);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState<'all' | CategoryId>('all');

    const { phrases: allPhrases, loading, error, refresh } = useContent();
    const [refreshing, setRefreshing] = useState(false);
    const { showToast } = useToast();

    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            await refresh();
        } catch (err) {
            showToast('Failed to refresh. Check your connection.', { type: 'error' });
        } finally {
            setRefreshing(false);
        }
    };

    // Filter phrases based on search query and selected filter
    const filteredPhrases = useMemo(() => {
        if (!allPhrases) return [];

        let phrases: Phrase[] = allPhrases;

        // Apply search filter
        if (searchQuery.trim()) {
            phrases = phrases.filter(phrase =>
                phrase.yoruba.toLowerCase().includes(searchQuery.toLowerCase()) ||
                phrase.english.toLowerCase().includes(searchQuery.toLowerCase()) ||
                phrase.code.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Apply category filter (for now, just return all as we don't have categories in dummy data)
        if (selectedFilter !== 'all') {
            phrases = phrases.filter((p) => p.category === selectedFilter);
        }
        return phrases;
    }, [allPhrases, searchQuery, selectedFilter]);

    const handlePhrasePress = (code: string) => {
        navigation.navigate('ContentDisplay', { code });
    };

    const renderPhraseCard = ({ item }: { item: Phrase }) => (
        <TouchableOpacity
            style={[styles.phraseCard, {
                backgroundColor: theme.COLORS.lightGray,
                borderColor: theme.COLORS.border
            }]}
            onPress={() => handlePhrasePress(item.code)}
            activeOpacity={0.7}
        >
            <View style={styles.cardHeader}>
                <Text style={[styles.codeText, { color: theme.COLORS.primary }]}>{item.code}</Text>
                <Feather name="play-circle" size={20} color={theme.COLORS.primary} />
            </View>
            <Text style={[styles.phraseText, { color: theme.COLORS.textPrimary }]} numberOfLines={3}>
                {item.yoruba}
            </Text>
            <View style={styles.cardFooter}>
                <Text style={[styles.tapToPlayText, { color: theme.COLORS.textSecondary }]}>Tap to play</Text>
            </View>
        </TouchableOpacity>
    );

    const FilterChip = ({
        label,
        value,
        isSelected
    }: {
        label: string;
        value: 'all' | CategoryId;
        isSelected: boolean;
    }) => (
        <TouchableOpacity
            style={[
                styles.filterChip,
                {
                    backgroundColor: isSelected ? theme.COLORS.primary : theme.COLORS.lightGray,
                    borderColor: isSelected ? theme.COLORS.primary : theme.COLORS.border
                }
            ]}
            onPress={() => setSelectedFilter(value)}
            activeOpacity={0.7}
        >
            <Text style={[
                styles.filterChipText,
                { color: isSelected ? theme.COLORS.background : theme.COLORS.textSecondary }
            ]}>
                {label}
            </Text>
        </TouchableOpacity>
    );

    useEffect(() => {
        if (error) {
            showToast('Network error loading phrases', { type: 'error' });
        }
    }, [error]);

    if (loading || !allPhrases) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: theme.COLORS.background, justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={theme.COLORS.primary} />
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: theme.COLORS.background, justifyContent: 'center', alignItems: 'center' }]}>
                <EmptyState icon="alert-circle" message={error.message} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.COLORS.background }]}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={[styles.headerTitle, { color: theme.COLORS.textPrimary }]}>Browse Phrases</Text>
                <Text style={[styles.headerSubtitle, { color: theme.COLORS.textSecondary }]}>
                    {allPhrases.length} phrases available
                </Text>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <StyledTextInput
                    placeholder="Search phrases, translations, or codes..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    leftIcon="search"
                />
            </View>

            {/* Filter Chips */}
            <View style={styles.filterContainer}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterScrollContent}
                >
                    <FilterChip label="All" value="all" isSelected={selectedFilter === 'all'} />
                    {CATEGORIES.map((cat) => (
                        <FilterChip
                            key={cat.id}
                            label={cat.label}
                            value={cat.id}
                            isSelected={selectedFilter === cat.id}
                        />
                    ))}
                </ScrollView>
            </View>

            {/* Results */}
            <View style={styles.resultsContainer}>
                <Text style={[styles.resultsCount, { color: theme.COLORS.textSecondary }]}>
                    {filteredPhrases.length} {filteredPhrases.length === 1 ? 'phrase' : 'phrases'} found
                </Text>

                {filteredPhrases.length > 0 ? (
                    <FlatList
                        data={filteredPhrases}
                        renderItem={renderPhraseCard}
                        keyExtractor={(item) => item.code}
                        numColumns={2}
                        columnWrapperStyle={styles.row}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContent}
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                    />
                ) : (
                    <EmptyState
                        icon="search"
                        message={
                            searchQuery.trim()
                                ? "No phrases match your search."
                                : "No phrases available in this category."
                        }
                    />
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
    },
    headerTitle: {
        fontSize: 22,
        fontFamily: 'Nunito-SemiBold',
        lineHeight: 30,
    },
    headerSubtitle: {
        fontSize: 13,
        fontFamily: 'Inter-Regular',
        lineHeight: 18,
        marginTop: 4,
    },
    searchContainer: {
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    filterContainer: {
        marginBottom: 16,
    },
    filterScrollContent: {
        paddingHorizontal: 20,
        gap: 12,
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
    },
    filterChipText: {
        fontSize: 12,
        fontFamily: 'Inter-Medium',
        lineHeight: 16,
    },
    resultsContainer: {
        flex: 1,
        paddingHorizontal: 20,
    },
    resultsCount: {
        fontSize: 12,
        fontFamily: 'Inter-Regular',
        lineHeight: 16,
        marginBottom: 16,
    },
    listContent: {
        paddingBottom: 20,
    },
    row: {
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    phraseCard: {
        flex: 1,
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 4,
        borderWidth: 1,
        minHeight: 120,
        justifyContent: 'space-between',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    codeText: {
        fontSize: 12,
        fontFamily: 'Inter-Medium',
        lineHeight: 16,
    },
    phraseText: {
        fontSize: 14,
        fontFamily: 'Inter-Medium',
        lineHeight: 20,
        marginBottom: 12,
        flex: 1,
    },
    cardFooter: {
        marginTop: 'auto',
        paddingTop: 8,
        borderTopWidth: 1,
    },
    tapToPlayText: {
        fontSize: 12,
        fontFamily: 'Inter-Regular',
        lineHeight: 16,
        textAlign: 'center',
        fontStyle: 'italic',
    },
});

export default BrowseScreen;
