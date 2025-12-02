import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SectionTitle } from '../atoms/SectionTitle';
import { BookingInfoRow } from '../molecules/BookingInfoRow';
import { PaymentSummaryRow } from '../molecules/PaymentSummaryRow';
import { AdditionalFeeItem } from '../templates/BookingDetailsTemplate';

interface PaymentSummaryCardProps {
    // Base Fees
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
}

export const PaymentSummaryCard: React.FC<PaymentSummaryCardProps> = ({
    rentalFee,
    insuranceFee,
    insuranceBadge,
    serviceFee,
    securityDeposit,
    totalPaid,
    paymentMethod,
    excessKmFee,
    cleaningFee,
    crossBranchFee,
    totalChargingFee,
    totalAdditionalFee,
    earlyHandoverFee,
    lateReturnFee,
    refundAmount,
    additionalFees,
}) => {
    // ✅ Check if any fees exist
    const hasFeeBreakdown = !!(
        excessKmFee || 
        cleaningFee || 
        crossBranchFee || 
        totalChargingFee || 
        earlyHandoverFee || 
        lateReturnFee
    );
    
    const hasAdditionalFees = additionalFees && additionalFees.length > 0;

    return (
        <View style={styles.container}>
            <SectionTitle title="Tóm tắt thanh toán" />
            <View style={styles.card}>
                {/* Base Fees */}
                <PaymentSummaryRow label="Phí thuê" amount={rentalFee} />
                <PaymentSummaryRow 
                    label="Bảo hiểm" 
                    amount={insuranceFee} 
                    badge={insuranceBadge}
                />
                <PaymentSummaryRow label="Phí dịch vụ" amount={serviceFee} />
                <PaymentSummaryRow 
                    label="Tiền cọc" 
                    amount={securityDeposit}
                    icon={<SecurityDepositIcon />}
                />
                
                {/* ✅ Fee Breakdown Section */}
                {hasFeeBreakdown && (
                    <>
                        <View style={styles.divider} />
                        <Text style={styles.sectionLabel}>Phí phụ trội</Text>
                        
                        {lateReturnFee && (
                            <PaymentSummaryRow 
                                label="Phí trả xe muộn" 
                                amount={lateReturnFee}
                                icon={<WarningIcon />}
                            />
                        )}
                        
                        {excessKmFee && (
                            <PaymentSummaryRow 
                                label="Phí vượt quá km" 
                                amount={excessKmFee} 
                            />
                        )}
                        
                        {cleaningFee && (
                            <PaymentSummaryRow 
                                label="Phí vệ sinh" 
                                amount={cleaningFee} 
                            />
                        )}
                        
                        {crossBranchFee && (
                            <PaymentSummaryRow 
                                label="Phí chuyển chi nhánh" 
                                amount={crossBranchFee} 
                            />
                        )}
                        
                        {totalChargingFee && (
                            <PaymentSummaryRow 
                                label="Phí sạc pin" 
                                amount={totalChargingFee} 
                            />
                        )}
                        
                        {earlyHandoverFee && (
                            <PaymentSummaryRow 
                                label="Phí bàn giao sớm" 
                                amount={earlyHandoverFee} 
                            />
                        )}
                        
                        {totalAdditionalFee && (
                            <PaymentSummaryRow 
                                label="Tổng phí phụ trội" 
                                amount={totalAdditionalFee}
                                isTotal
                            />
                        )}
                    </>
                )}
                
                {/* ✅ Additional Fees List */}
                {hasAdditionalFees && (
                    <>
                        <View style={styles.divider} />
                        <Text style={styles.sectionLabel}>Chi tiết phí khác</Text>
                        
                        {additionalFees.map((fee) => (
                            <View key={fee.id} style={styles.additionalFeeItem}>
                                <View style={styles.additionalFeeLeft}>
                                    <Text style={styles.additionalFeeFeeType}>{fee.feeType}</Text>
                                    <Text style={styles.additionalFeeDescription}>{fee.description}</Text>
                                </View>
                                <Text style={styles.additionalFeeAmount}>{fee.amount}</Text>
                            </View>
                        ))}
                    </>
                )}
                
                {/* Total */}
                <PaymentSummaryRow 
                    label="Tổng thanh toán" 
                    amount={totalPaid} 
                    isTotal 
                />
                
                {/* ✅ Refund Amount */}
                {refundAmount !== undefined && (
                    <PaymentSummaryRow 
                        label="Số tiền hoàn lại" 
                        amount={refundAmount}
                        icon={<RefundIcon />}
                    />
                )}
                
                <View style={styles.divider} />
                <BookingInfoRow label="Phương thức" value={paymentMethod} />
            </View>
        </View>
    );
};

// Icon components
const SecurityDepositIcon = () => (
    <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: '#BB86FC' }} />
);

const WarningIcon = () => (
    <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: '#F59E0B' }} />
);

const RefundIcon = () => (
    <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: '#22C55E' }} />
);

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
    },
    card: {
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        padding: 16,
    },
    divider: {
        height: 1,
        backgroundColor: '#2C2C2C',
        marginVertical: 12,
    },
    sectionLabel: {
        color: '#BB86FC',
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    // ✅ Additional Fee Item Styles
    additionalFeeItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingVertical: 10,
        paddingHorizontal: 12,
        backgroundColor: '#0f0f0f',
        borderRadius: 8,
        marginBottom: 8,
        borderLeftWidth: 3,
        borderLeftColor: '#BB86FC',
    },
    additionalFeeLeft: {
        flex: 1,
        marginRight: 12,
    },
    additionalFeeFeeType: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 2,
    },
    additionalFeeDescription: {
        color: '#9E9E9E',
        fontSize: 12,
        lineHeight: 16,
    },
    additionalFeeAmount: {
        color: '#F59E0B',
        fontSize: 14,
        fontWeight: '700',
    },
});