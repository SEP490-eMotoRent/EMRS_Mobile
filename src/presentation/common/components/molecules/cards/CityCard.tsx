import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { BuildingIcon } from '../../atoms/icons/searchBarIcons/BuildingIcon';

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
            <BuildingIcon />
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