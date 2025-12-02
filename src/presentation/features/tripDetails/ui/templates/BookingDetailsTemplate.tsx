import React from 'react';
import { Linking, ScrollView, StyleSheet, View } from 'react-native';
import { BookingStatusBadge } from '../atoms/BookingStatusBadge';
import { IconButton } from '../atoms/IconButton';
import { BookingInformationCard } from '../organisms/BookingInformationCard';
import { ContractInformationCard } from '../organisms/ContractInformationCard';
import { ImportantNotesCard } from '../organisms/ImportantNotesCard';
import { PaymentSummaryCard } from '../organisms/PaymentSummaryCard';
import { PickupDetailsCard } from '../organisms/PickupDetailsCard';

export interface AdditionalFeeItem {
    id: string;
    feeType: string;
    description: string;
    amount: string;
}

export interface BookingDetailsData {
    // Status
    status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
    startsIn: string;
    
    // Booking Information
    bookingReference: string;
    contractStatus: string;
    contractVerified: boolean;
    vehicleName: string;
    rentalPeriod: string;
    duration: string;
    vehicleImageUrl?: string;
    
    // Pickup Details
    branchName: string;
    branchAddress: string;
    operatingHours: string;
    branchPhone: string;
    
    // Payment Summary - Base Fees
    rentalFee: string;
    insuranceFee: string;
    insuranceBadge?: string;
    serviceFee: string;
    securityDeposit: string;
    totalPaid: string;
    paymentMethod: string;
    
    // ✅ NEW: Fee Breakdown
    excessKmFee?: string;
    cleaningFee?: string;
    crossBranchFee?: string;
    totalChargingFee?: string;
    totalAdditionalFee?: string;
    earlyHandoverFee?: string;
    lateReturnFee?: string;
    refundAmount?: string;
    
    // ✅ NEW: Additional Fees Array
    additionalFees?: AdditionalFeeItem[];
    
    // Contract Information
    digitalSignatureCompleted: boolean;
    signedOn: string;
    otpVerified: boolean;
    keyTerms: string[];
    
    // Important Notes
    cancellationPolicy: string;
    lateArrivalPolicy: string;
    emergencyHotline: string;
}

interface BookingDetailsTemplateProps {
    data: BookingDetailsData;
    onGetDirections: () => void;
    onCallBranch: () => void;
    onViewFullContract: () => void;
    onDownloadContract: () => void;
    onAddToCalendar: () => void;
    onContactBranch: () => void;
    onCancelBooking: () => void;
}

export const BookingDetailsTemplate: React.FC<BookingDetailsTemplateProps> = ({
    data,
    onGetDirections,
    onCallBranch,
    onViewFullContract,
    onDownloadContract,
    onAddToCalendar,
    onContactBranch,
    onCancelBooking,
}) => {
    const handleEmergencyCall = () => {
        Linking.openURL(`tel:${data.emergencyHotline}`);
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Header with status badge and starts in info */}
                <View style={styles.header}>
                    <BookingStatusBadge status={data.status} />
                    <View style={styles.startsInContainer}>
                        <View style={styles.calendarIcon}>
                            <View style={styles.calendarIconInner} />
                        </View>
                        <View style={styles.startsInText}>
                            <View style={styles.startsInBar} />
                        </View>
                    </View>
                </View>

                {/* Booking Information Section */}
                <BookingInformationCard
                    bookingReference={data.bookingReference}
                    contractStatus={data.contractStatus}
                    contractVerified={data.contractVerified}
                    vehicleName={data.vehicleName}
                    rentalPeriod={data.rentalPeriod}
                    duration={data.duration}
                    vehicleImageUrl={data.vehicleImageUrl}
                />

                {/* Pickup Details Section */}
                <PickupDetailsCard
                    branchName={data.branchName}
                    address={data.branchAddress}
                    operatingHours={data.operatingHours}
                    phoneNumber={data.branchPhone}
                    onGetDirections={onGetDirections}
                    onCallBranch={onCallBranch}
                />

                {/* Payment Summary Section - ✅ WITH NEW PROPS */}
                <PaymentSummaryCard
                    rentalFee={data.rentalFee}
                    insuranceFee={data.insuranceFee}
                    insuranceBadge={data.insuranceBadge}
                    serviceFee={data.serviceFee}
                    securityDeposit={data.securityDeposit}
                    totalPaid={data.totalPaid}
                    paymentMethod={data.paymentMethod}
                    excessKmFee={data.excessKmFee}
                    cleaningFee={data.cleaningFee}
                    crossBranchFee={data.crossBranchFee}
                    totalChargingFee={data.totalChargingFee}
                    totalAdditionalFee={data.totalAdditionalFee}
                    earlyHandoverFee={data.earlyHandoverFee}
                    lateReturnFee={data.lateReturnFee}
                    refundAmount={data.refundAmount}
                    additionalFees={data.additionalFees}
                />

                {/* Contract Information Section */}
                <ContractInformationCard
                    digitalSignatureCompleted={data.digitalSignatureCompleted}
                    signedOn={data.signedOn}
                    otpVerified={data.otpVerified}
                    keyTerms={data.keyTerms}
                    onViewFullContract={onViewFullContract}
                />

                {/* Important Notes Section */}
                <ImportantNotesCard
                    cancellationPolicy={data.cancellationPolicy}
                    lateArrivalPolicy={data.lateArrivalPolicy}
                    emergencyHotline={data.emergencyHotline}
                    onEmergencyCall={handleEmergencyCall}
                />

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                    <IconButton
                        icon={<DownloadIcon />}
                        label="Download Contract PDF"
                        onPress={onDownloadContract}
                        variant="primary"
                    />
                    
                    <View style={styles.buttonRow}>
                        <View style={styles.halfButton}>
                            <IconButton
                                icon={<CalendarIcon />}
                                label="Add to Calendar"
                                onPress={onAddToCalendar}
                                variant="secondary"
                            />
                        </View>
                        <View style={styles.halfButton}>
                            <IconButton
                                icon={<PhoneIcon />}
                                label="Contact Branch"
                                onPress={onContactBranch}
                                variant="secondary"
                            />
                        </View>
                    </View>

                    <IconButton
                        icon={<CancelIcon />}
                        label="Cancel Booking"
                        onPress={onCancelBooking}
                        variant="danger"
                    />
                </View>
            </ScrollView>
        </View>
    );
};

// Icon components
const DownloadIcon = () => (
    <View style={{ width: 20, height: 20, backgroundColor: '#000', borderRadius: 4 }} />
);

const CalendarIcon = () => (
    <View style={{ width: 20, height: 20, backgroundColor: '#9E9E9E', borderRadius: 4 }} />
);

const PhoneIcon = () => (
    <View style={{ width: 20, height: 20, backgroundColor: '#9E9E9E', borderRadius: 10 }} />
);

const CancelIcon = () => (
    <View style={{ width: 20, height: 20, backgroundColor: '#F44336', borderRadius: 4 }} />
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 16,
    },
    header: {
        paddingVertical: 20,
    },
    startsInContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
    },
    calendarIcon: {
        width: 20,
        height: 20,
        backgroundColor: '#2C2C2C',
        borderRadius: 4,
        marginRight: 8,
    },
    calendarIconInner: {
        width: 12,
        height: 12,
        backgroundColor: '#fff',
        borderRadius: 2,
        margin: 4,
    },
    startsInText: {
        flex: 1,
    },
    startsInBar: {
        height: 12,
        backgroundColor: '#2C2C2C',
        borderRadius: 6,
        width: '60%',
    },
    actionButtons: {
        marginBottom: 40,
        gap: 12,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 12,
    },
    halfButton: {
        flex: 1,
    },
});