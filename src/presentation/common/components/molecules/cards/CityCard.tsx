import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CityCardProps {
    cityName: string;
    state: string;
    onPress: () => void;
}

export const CityCard: React.FC<CityCardProps> = ({
    cityName,
    state,
    onPress,
}) => {
    return (
        <TouchableOpacity 
            style={styles.cityBox}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <Ionicons name="storefront" size={26} color="#A78BFA" />
            <View style={styles.cityContent}>
                <Text style={styles.cityName}>{cityName}</Text>
                <Text style={styles.citySub}>{state}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    cityBox: {
        backgroundColor: '#111',
        borderRadius: 10,
        padding: 14,
        marginVertical: 6,
        flexDirection: 'row',
        alignItems: 'center',
    },
    cityContent: {
        flex: 1,
        marginLeft: 16, // ✅ Add spacing from icon
    },
    cityName: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 15,
    },
    citySub: {
        color: '#aaa',
        fontSize: 13,
        marginTop: 2,
    },
});