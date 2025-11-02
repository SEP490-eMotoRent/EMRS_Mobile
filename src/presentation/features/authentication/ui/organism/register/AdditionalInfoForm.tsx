// src/features/auth/components/organism/AdditionalInfoForm.tsx
import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button } from '../../../../../common/components/atoms/buttons/Button';
import { CalendarIcon } from '../../../../../common/components/atoms/icons/searchBarIcons/CalendarIcon';
import { Input } from '../../../../../common/components/atoms/Input';
import { DateOfBirthPicker } from '../../molecules/DateOfBirthPicker';

interface AdditionalInfoFormProps {
    onComplete: (data: { 
        fullname: string; 
        username: string; 
        phone: string; 
        address: string; 
        dateOfBirth: string;
        avatarUrl?: string;
    }) => void;
    loading?: boolean;
}

export const AdditionalInfoForm: React.FC<AdditionalInfoFormProps> = ({ 
    onComplete, 
    loading = false 
}) => {
    const [fullname, setFullname] = useState('');
    const [username, setUsername] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleComplete = () => {
        onComplete({ 
            fullname, 
            username, 
            phone, 
            address, 
            dateOfBirth,
            avatarUrl: ''
        });
    };

    const handleDateConfirm = (date: string) => {
        setDateOfBirth(date);
        setShowDatePicker(false);
    };

    const formatDateDisplay = (dateStr: string) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    };

    const isFormValid = 
        fullname.trim() !== '' && 
        username.trim() !== '' && 
        phone.trim() !== '' && 
        address.trim() !== '' && 
        dateOfBirth.trim() !== '';

    const buttonStyle = {
        ...styles.completeButton,
        ...((!isFormValid || loading) && styles.disabledButton)
    };

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <Input
                    placeholder="Full Name"
                    value={fullname}
                    onChangeText={setFullname}
                    autoCapitalize="words"
                    editable={!loading}
                />
                <Input
                    placeholder="Username"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                    editable={!loading}
                />
                <Input
                    placeholder="Phone Number"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                    editable={!loading}
                />
                <Input
                    placeholder="Address"
                    value={address}
                    onChangeText={setAddress}
                    editable={!loading}
                />

                {/* Date of Birth with Calendar Icon */}
                <TouchableOpacity
                    style={styles.datePickerButton}
                    onPress={() => setShowDatePicker(true)}
                    disabled={loading}
                >
                    <CalendarIcon />
                    <View style={styles.dateContent}>
                        {dateOfBirth ? (
                            <>
                                <Text style={styles.dateLabel}>Date of Birth</Text>
                                <Text style={styles.dateText}>
                                    {formatDateDisplay(dateOfBirth)}
                                </Text>
                            </>
                        ) : (
                            <Text style={styles.datePlaceholder}>Select Date of Birth</Text>
                        )}
                    </View>
                </TouchableOpacity>
            </View>

            <Button
                title={loading ? 'Creating Account...' : 'Complete Registration'}
                onPress={handleComplete}
                variant="primary"
                style={buttonStyle}
                textStyle={styles.completeButtonText}
                disabled={!isFormValid || loading}
            />
            
            {loading && (
                <ActivityIndicator 
                    size="small" 
                    color="#FFFFFF" 
                    style={styles.loader} 
                />
            )}

            {/* Date Picker Modal */}
            <DateOfBirthPicker
                visible={showDatePicker}
                onClose={() => setShowDatePicker(false)}
                onConfirm={handleDateConfirm}
                selectedDate={dateOfBirth}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginBottom: 10,
    },
    inputContainer: {
        marginBottom: 32,
    },
    datePickerButton: {
        backgroundColor: '#000',
        borderWidth: 1,
        borderColor: '#FFFFFF',
        borderRadius: 8,
        padding: 14,
        marginVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 50,
    },
    dateContent: {
        flex: 1,
        marginLeft: 10,
    },
    dateLabel: {
        color: '#888',
        fontSize: 12,
        marginBottom: 2,
    },
    dateText: {
        color: '#b8a4ff',
        fontSize: 15,
        fontWeight: '500',
    },
    datePlaceholder: {
        color: '#CCCCCC',
        fontSize: 15,
    },
    completeButton: {
        backgroundColor: '#000000',
        borderWidth: 1,
        borderColor: '#FFFFFF',
        height: 56,
        borderRadius: 28,
    },
    disabledButton: {
        opacity: 0.5,
    },
    completeButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loader: {
        position: 'absolute',
        right: 20,
        top: 18,
    },
});