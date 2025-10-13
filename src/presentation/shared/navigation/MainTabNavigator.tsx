import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { BottomNavigationBar, NavRoute } from '../../common/components/organisms/BottomNavigationBar';
import { HomeNavigator } from './HomeNavigator';
import { ProfileNavigator } from './ProfileNavigator';

export const MainNavigator: React.FC = () => {
    const [activeRoute, setActiveRoute] = useState<NavRoute>('home');

    const renderScreen = () => {
        switch (activeRoute) {
        case 'home':
            return <HomeNavigator />;
        case 'profile':
            return <ProfileNavigator />;
        case 'schedule':
            return <HomeNavigator />;
        case 'battery':
            return <HomeNavigator />;
        default:
            return <HomeNavigator />;
        }
    };

    return (
        <View style={styles.container}>
        <View style={styles.content}>{renderScreen()}</View>
        <BottomNavigationBar activeRoute={activeRoute} onNavigate={setActiveRoute} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { flex: 1 },
});
