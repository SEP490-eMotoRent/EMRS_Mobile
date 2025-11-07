import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Avatar } from '../atoms/Avatar';
import { Badge } from '../atoms/Badge';
import { Icon } from '../atoms/Icons/Icons';

interface ProfileHeaderProps {
    name: string;
    memberSince: string;
    trips: string;
    distance: string;
    onEdit: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ 
    name, 
    memberSince, 
    trips, 
    distance, 
    onEdit 
    }) => {
    return (
        <View style={styles.profileHeader}>
        <View style={styles.profileInfo}>
            <Avatar name={name} />
            <View style={styles.profileDetails}>
            <Text style={styles.profileName}>{name}</Text>
            <Text style={styles.profileMeta}>Thành viên kể từ: {memberSince}</Text>
            <Text style={styles.profileMeta}>{trips} Chuyến đi hoàn thành, đã đi được {distance}</Text>
            </View>
        </View>
        <TouchableOpacity onPress={onEdit} style={styles.editButton}>
            <Icon name="edit" />
        </TouchableOpacity>
        <Badge type="error">Cần Kiếm Chứng Tài Khoản</Badge>
        </View>
    );
};

const styles = StyleSheet.create({
    profileHeader: {
        padding: 20,
        position: 'relative',
    },
    profileInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileDetails: {
        marginLeft: 16,
        flex: 1,
    },
    profileName: {
        color: '#fff',
        fontSize: 24,
        fontWeight: '700',
    },
    profileMeta: {
        color: '#999',
        fontSize: 13,
        marginTop: 2,
    },
    editButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#222',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
