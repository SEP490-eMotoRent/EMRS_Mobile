import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { Booking } from '../../../../domain/entities/booking/Booking';
import { BookingDetailsData, AdditionalFeeItem } from '../ui/templates/BookingDetailsTemplate';
import sl from '../../../../core/di/InjectionContainer';

interface UseBookingDetailsReturn {
    bookingData: BookingDetailsData | null;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export const useBookingDetails = (bookingId: string, bookingReference?: string): UseBookingDetailsReturn => {
    const [bookingData, setBookingData] = useState<BookingDetailsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchBookingDetails = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('🔍 [BOOKING DETAILS] Fetching booking details for ID:', bookingId);

            const getBookingByIdUseCase = sl.getGetBookingByIdUseCase();
            const booking = await getBookingByIdUseCase.execute(bookingId);

            if (!booking) {
                throw new Error('Booking not found');
            }

            console.log('✅ [BOOKING DETAILS] Booking fetched successfully');
            console.log('📊 [BOOKING DETAILS] Raw Booking Entity:', JSON.stringify(booking, null, 2));
            console.log('📋 [BOOKING DETAILS] Additional Fees:', booking.additionalFees);
            console.log('📋 [BOOKING DETAILS] Fee Breakdown:', {
                excessKmFee: booking.excessKmFee,
                cleaningFee: booking.cleaningFee,
                crossBranchFee: booking.crossBranchFee,
                totalChargingFee: booking.totalChargingFee,
                totalAdditionalFee: booking.totalAdditionalFee,
                earlyHandoverFee: booking.earlyHandoverFee,
                lateReturnFee: booking.lateReturnFee,
                refundAmount: booking.refundAmount,
            });

            // Map Booking entity to BookingDetailsData
            const data: BookingDetailsData = mapBookingToDetailsData(booking, bookingReference);

            console.log('🔄 [BOOKING DETAILS] Mapped BookingDetailsData:', JSON.stringify(data, null, 2));

            setBookingData(data);
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to load booking details';
            console.error('❌ [BOOKING DETAILS] Error fetching booking details:', err);
            console.error('❌ [BOOKING DETAILS] Error stack:', err.stack);
            setError(errorMessage);
            Alert.alert('Error', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (bookingId) {
            fetchBookingDetails();
        }
    }, [bookingId]);

    return {
        bookingData,
        loading,
        error,
        refetch: fetchBookingDetails,
    };
};

// Helper function to map Booking entity to BookingDetailsData
const mapBookingToDetailsData = (booking: Booking, bookingReference?: string): BookingDetailsData => {
    console.log('🔄 [MAPPING] Starting to map booking to details data');
    
    // Calculate status
    const status = mapBookingStatus(booking.bookingStatus);
    console.log('📌 [MAPPING] Status:', status, '(from', booking.bookingStatus, ')');

    // Calculate starts in
    const startsIn = calculateStartsIn(booking.startDatetime);
    console.log('📌 [MAPPING] Starts in:', startsIn);

    // Format dates
    const rentalPeriod = formatRentalPeriod(booking.startDatetime, booking.endDatetime);
    const duration = calculateDuration(booking.startDatetime, booking.endDatetime);
    console.log('📌 [MAPPING] Rental period:', rentalPeriod);
    console.log('📌 [MAPPING] Duration:', duration);

    // Get vehicle and branch information
    const vehicleName = booking.vehicleModel?.modelName || 'Unknown Vehicle';
    const vehicleImageUrl = booking.vehicle?.fileUrl?.[0]; // Take first image from array
    console.log('📌 [MAPPING] Vehicle name:', vehicleName);
    console.log('📌 [MAPPING] Vehicle image URL:', vehicleImageUrl);

    // Get branch information (using handover branch if available)
    const branchName = booking.handoverBranch?.branchName || 'Branch';
    const branchAddress = booking.handoverBranch?.address || 'Address not available';
    const branchPhone = booking.handoverBranch?.phone || '+84 123 456 789';
    const operatingHours = booking.handoverBranch?.openingTime && booking.handoverBranch?.closingTime
        ? `${booking.handoverBranch.openingTime} - ${booking.handoverBranch.closingTime}`
        : 'Open 24/7';
    console.log('📌 [MAPPING] Branch name:', branchName);
    console.log('📌 [MAPPING] Branch address:', branchAddress);
    console.log('📌 [MAPPING] Operating hours:', operatingHours);

    // Get insurance information
    const insurancePackageName = booking.insurancePackage?.packageName || 'Standard';
    const insuranceFee = formatCurrency(booking.insurancePackage?.packageFee || 0);
    console.log('📌 [MAPPING] Insurance package:', insurancePackageName);
    console.log('📌 [MAPPING] Insurance fee:', insuranceFee);

    // Format payment information
    const rentalFee = formatCurrency(booking.baseRentalFee);
    const serviceFee = formatCurrency(0); // Service fee not in entity
    const securityDeposit = formatCurrency(booking.depositAmount);
    const totalPaid = formatCurrency(booking.totalAmount);
    console.log('📌 [MAPPING] Rental fee:', rentalFee);
    console.log('📌 [MAPPING] Service fee:', serviceFee, '(HARDCODED)');
    console.log('📌 [MAPPING] Security deposit:', securityDeposit);
    console.log('📌 [MAPPING] Total paid:', totalPaid);

    // ✅ NEW: Map fee breakdown
    const excessKmFee = booking.excessKmFee ? formatCurrency(booking.excessKmFee) : undefined;
    const cleaningFee = booking.cleaningFee ? formatCurrency(booking.cleaningFee) : undefined;
    const crossBranchFee = booking.crossBranchFee ? formatCurrency(booking.crossBranchFee) : undefined;
    const totalChargingFee = booking.totalChargingFee ? formatCurrency(booking.totalChargingFee) : undefined;
    const totalAdditionalFee = booking.totalAdditionalFee ? formatCurrency(booking.totalAdditionalFee) : undefined;
    const earlyHandoverFee = booking.earlyHandoverFee ? formatCurrency(booking.earlyHandoverFee) : undefined;
    const lateReturnFee = booking.lateReturnFee ? formatCurrency(booking.lateReturnFee) : undefined;
    const refundAmount = booking.refundAmount !== undefined ? formatCurrency(booking.refundAmount) : undefined;
    
    console.log('📌 [MAPPING] Fee Breakdown:', {
        excessKmFee,
        cleaningFee,
        crossBranchFee,
        totalChargingFee,
        totalAdditionalFee,
        earlyHandoverFee,
        lateReturnFee,
        refundAmount,
    });

    // ✅ NEW: Map additional fees array
    const additionalFees: AdditionalFeeItem[] | undefined = booking.additionalFees?.map(fee => ({
        id: fee.id,
        feeType: fee.feeType,
        description: fee.description,
        amount: formatCurrency(fee.amount),
    }));
    
    console.log('📌 [MAPPING] Additional Fees Array:', additionalFees);

    // Get contract information
    const contractStatus = booking.rentalContract?.contractStatus || 'Pending';
    const digitalSignatureCompleted = booking.rentalContract?.contractStatus === 'SIGNED';
    const signedOn = booking.rentalContract?.createdAt 
        ? formatDate(booking.rentalContract.createdAt) 
        : 'Not signed yet';
    const otpVerified = booking.rentalContract?.contractStatus === 'SIGNED';
    console.log('📌 [MAPPING] Contract status:', contractStatus);
    console.log('📌 [MAPPING] Digital signature completed:', digitalSignatureCompleted);
    console.log('📌 [MAPPING] Signed on:', signedOn);

    // Key terms (these would ideally come from contract terms)
    const keyTerms: string[] = booking.rentalContract?.contractTerms 
        ? booking.rentalContract.contractTerms.split('\n').filter(term => term.trim() !== '')
        : [
            'Refund up to 24 hours before pickup',
            'Late arrivals (>30 min) may result in cancellation',
            'Renter is liable for damages not covered by insurance',
            'Vehicle must be returned with minimum 10% battery',
        ];
    console.log('📌 [MAPPING] Key terms count:', keyTerms.length);

    console.log('✅ [MAPPING] Mapping completed successfully');

    return {
        // Status
        status,
        startsIn,

        // Booking Information
        bookingReference: bookingReference || booking.bookingCode || `#${booking.id.slice(0, 12)}`,
        contractStatus,
        contractVerified: digitalSignatureCompleted,
        vehicleName,
        rentalPeriod,
        duration,
        vehicleImageUrl,

        // Pickup Details
        branchName,
        branchAddress,
        operatingHours,
        branchPhone,

        // Payment Summary - Base Fees
        rentalFee,
        insuranceFee,
        insuranceBadge: insurancePackageName,
        serviceFee,
        securityDeposit,
        totalPaid,
        paymentMethod: 'eMotoRent Wallet',

        // ✅ NEW: Fee Breakdown
        excessKmFee,
        cleaningFee,
        crossBranchFee,
        totalChargingFee,
        totalAdditionalFee,
        earlyHandoverFee,
        lateReturnFee,
        refundAmount,

        // ✅ NEW: Additional Fees Array
        additionalFees,

        // Contract Information
        digitalSignatureCompleted,
        signedOn,
        otpVerified,
        keyTerms,

        // Important Notes
        cancellationPolicy: 'Free until 24h before pickup, 50% fee after that',
        lateArrivalPolicy: 'May result in booking cancellation with 50% fee',
        emergencyHotline: '1900 1234',
    };
};

// Helper function to map booking status
const mapBookingStatus = (status: string): 'confirmed' | 'pending' | 'cancelled' | 'completed' => {
    const statusLower = status.toLowerCase();
    
    if (statusLower.includes('confirm') || statusLower === 'booked') {
        return 'confirmed';
    } else if (statusLower.includes('pending')) {
        return 'pending';
    } else if (statusLower.includes('cancel')) {
        return 'cancelled';
    } else if (statusLower.includes('complete') || statusLower.includes('finished')) {
        return 'completed';
    }
    
    return 'pending';
};

// Helper function to calculate time until booking starts
const calculateStartsIn = (startDatetime?: Date): string => {
    if (!startDatetime) return 'Unknown';

    const now = new Date();
    const start = new Date(startDatetime);
    const diff = start.getTime() - now.getTime();

    if (diff < 0) return 'Started';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) {
        return `${days} days ${hours} hours ${minutes} minutes`;
    } else if (hours > 0) {
        return `${hours} hours ${minutes} minutes`;
    } else {
        return `${minutes} minutes`;
    }
};

// Helper function to format rental period
const formatRentalPeriod = (startDatetime?: Date, endDatetime?: Date): string => {
    if (!startDatetime || !endDatetime) return 'Not specified';

    const formatDateTime = (date: Date): string => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const day = date.getDate();
        const month = months[date.getMonth()];
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const period = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;

        return `${month} ${day} ${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
    };

    return `${formatDateTime(new Date(startDatetime))} - ${formatDateTime(new Date(endDatetime))}`;
};

// Helper function to calculate duration
const calculateDuration = (startDatetime?: Date, endDatetime?: Date): string => {
    if (!startDatetime || !endDatetime) return 'Unknown';

    const start = new Date(startDatetime);
    const end = new Date(endDatetime);
    const diff = end.getTime() - start.getTime();

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) {
        return `${days} days ${hours} hours`;
    } else {
        return `${hours} hours`;
    }
};

// Helper function to format currency
const formatCurrency = (amount: number): string => {
    return `${amount.toLocaleString('vi-VN')}đ`;
};

// Helper function to format date
const formatDate = (date: Date): string => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const d = new Date(date);
    const day = d.getDate();
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    const hours = d.getHours();
    const minutes = d.getMinutes();

    return `${month} ${day}, ${year} - ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};