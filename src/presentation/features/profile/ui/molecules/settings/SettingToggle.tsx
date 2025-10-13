import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { Icon } from '../../atoms/Icons/Icons';
import { IconName } from '../../temp';

interface SettingToggleProps {
    icon: IconName;
    label: string;
    value: boolean;
    onToggle: (value: boolean) => void;
}

export const SettingToggle: React.FC<SettingToggleProps> = ({ icon, label, value, onToggle }) => {
    return (
        <View style={styles.settingItem}>
        <View style={styles.settingLeft}>
            <Icon name={icon} />
            <Text style={styles.settingLabel}>{label}</Text>
        </View>
        <Switch
            value={value}
            onValueChange={onToggle}
            trackColor={{ false: '#444', true: '#a78bfa' }}
            thumbColor={value ? '#fff' : '#ccc'}
        />
        </View>
    );
};

const styles = StyleSheet.create({
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#2a2a2a',
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    settingLabel: {
        color: '#fff',
        fontSize: 15,
    },
});