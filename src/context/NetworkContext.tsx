import React, { createContext, useContext, useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { useToast } from './ToastContext';

interface NetworkContextValue {
    /** null = unknown (still fetching), otherwise online status */
    isConnected: boolean | null;
}

const NetworkContext = createContext<NetworkContextValue>({ isConnected: null });

export const NetworkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isConnected, setIsConnected] = useState<boolean | null>(null);
    const { showToast } = useToast();

    useEffect(() => {
        // Subscribe to connectivity changes
        const unsubscribe = NetInfo.addEventListener((state: any) => {
            const online = Boolean(state.isConnected && state.isInternetReachable !== false);
            setIsConnected(online);

            // Notify user when connectivity changes
            if (online) {
                if (isConnected === false) {
                    // We were offline and just came back
                    showToast('Back online', { type: 'success' });
                }
            } else {
                if (isConnected === true || isConnected === null) {
                    // Just went offline
                    showToast('You are offline', { type: 'error', duration: 4000 });
                }
            }
        });

        return () => unsubscribe();
        // We deliberately omit isConnected from deps to avoid immediate toast on mount
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showToast]);

    return (
        <NetworkContext.Provider value={{ isConnected }}>
            {children}
        </NetworkContext.Provider>
    );
};

export const useNetwork = () => {
    return useContext(NetworkContext);
}; 