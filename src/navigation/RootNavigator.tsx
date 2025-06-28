import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';
import OnboardingNavigator from './OnboardingNavigator';
import { useAuth } from '../context/AuthContext';
import { useOnboarding } from '../context/OnboardingContext';

const RootNavigator = () => {
    const { isAuthenticated } = useAuth();
    const { hasSeenOnboarding } = useOnboarding();

    // While onboarding flag is loading, show nothing to avoid flicker
    if (hasSeenOnboarding === null) return null;

    let content;
    if (!isAuthenticated) {
        content = <AuthNavigator />;
    } else if (!hasSeenOnboarding) {
        content = <OnboardingNavigator />;
    } else {
        content = <AppNavigator />;
    }

    return <NavigationContainer>{content}</NavigationContainer>;
};

export default RootNavigator; 