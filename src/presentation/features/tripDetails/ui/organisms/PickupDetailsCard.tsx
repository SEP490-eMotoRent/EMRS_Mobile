import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SectionTitle } from '../atoms/SectionTitle';

interface PickupDetailsCardProps {
    branchName: string;
    address: string;
    operatingHours: string;
    phoneNumber: string;
    onGetDirections: () => void;
    onCallBranch: () => void;
}

    export const PickupDetailsCard: React.FC<PickupDetailsCardProps> = ({
            branchName,
            address,
            operatingHours,
            phoneNumber,
            onGetDirections,
            onCallBranch,
        }) => {
            return (
                <View style={styles.container}>
                <SectionTitle title="Thông tin nhận xe" />
                    <View style={styles.card}>
                        <View style={styles.mapPlaceholder}>
                        <Text style={styles.mapText}>Bản đồ</Text>
                        </View>

                        <View style={styles.detailsContainer}>
                        <Text style={styles.branchName}>{branchName}</Text>
                        <Text style={styles.address}>{address}</Text>

                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Giờ mở cửa</Text>
                            <Text style={styles.value}>{operatingHours}</Text>
                        </View>

                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Liên hệ chi nhánh</Text>
                            <TouchableOpacity onPress={onCallBranch}>
                            <Text style={styles.phoneNumber}>{phoneNumber}</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={styles.directionsButton} onPress={onGetDirections}>
                            <Text style={styles.directionsText}>Chỉ đường</Text>
                        </TouchableOpacity>
                        </View>
                    </View>
                </View>
            );
    };

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
    },
    card: {
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        overflow: 'hidden',
    },
    mapPlaceholder: {
        height: 150,
        backgroundColor: '#2C3E50',
        justifyContent: 'center',
        alignItems: 'center',
    },
    mapText: {
        color: '#9E9E9E',
        fontSize: 16,
    },
    detailsContainer: {
        padding: 16,
    },
    branchName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    address: {
        color: '#9E9E9E',
        fontSize: 13,
        marginBottom: 16,
        lineHeight: 18,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    label: {
        color: '#9E9E9E',
        fontSize: 13,
    },
    value: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '500',
    },
    phoneNumber: {
        color: '#BB86FC',
        fontSize: 13,
        fontWeight: '500',
    },
    directionsButton: {
        backgroundColor: '#2C2C2C',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 8,
    },
    directionsText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
});