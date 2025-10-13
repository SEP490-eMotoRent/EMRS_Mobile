import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from '../../atoms/Icons/Icons';
import { IconName } from '../../temp';


interface SettingItemProps {
    icon: IconName;
    label: string;
    value?: string;
    onPress?: () => void;
    showArrow?: boolean;
}

export const SettingItem: React.FC<SettingItemProps> = ({ 
    icon, 
    label, 
    value, 
    onPress, 
    showArrow = true 
    }) => {
    return (
        <TouchableOpacity style={styles.settingItem} onPress={onPress}>
        <View style={styles.settingLeft}>
            <Icon name={icon} />
            <Text style={styles.settingLabel}>{label}</Text>
        </View>
        <View style={styles.settingRight}>
            {value && <Text style={styles.settingValue}>{value}</Text>}
            {showArrow && <Icon name="arrow" color="#666" />}
        </View>
        </TouchableOpacity>
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
    settingRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    settingValue: {
        color: '#999',
        fontSize: 14,
    },
});