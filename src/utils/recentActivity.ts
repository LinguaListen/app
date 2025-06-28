import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Phrase } from '../types/phrase';

export interface RecentActivityItem {
    id: string;
    phrase: string;
    translation: string;
    timestamp: number;
}

const STORAGE_KEY = '@recentActivity';
const MAX_ITEMS = 20;

export async function getRecentActivity(): Promise<RecentActivityItem[]> {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    if (!json) return [];
    try {
        return JSON.parse(json) as RecentActivityItem[];
    } catch {
        return [];
    }
}

export async function addRecentActivity(phrase: Phrase): Promise<RecentActivityItem[]> {
    const list = await getRecentActivity();
    const filtered = list.filter((item) => item.id !== phrase.id);
    const newItem: RecentActivityItem = {
        id: phrase.id,
        phrase: phrase.yoruba,
        translation: phrase.english,
        timestamp: Date.now(),
    };
    const updated = [newItem, ...filtered].slice(0, MAX_ITEMS);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
}

export async function clearRecentActivity() {
    await AsyncStorage.removeItem(STORAGE_KEY);
}

export function useRecentActivity() {
    const [activities, setActivities] = useState<RecentActivityItem[] | null>(null);

    const refresh = async () => {
        const list = await getRecentActivity();
        setActivities(list);
    };

    useEffect(() => {
        refresh();
    }, []);

    return { activities, refresh };
} 