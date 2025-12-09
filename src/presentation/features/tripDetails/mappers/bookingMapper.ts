import { Booking } from '../../../../domain/entities/booking/Booking';
import { BookingDetailsData, AdditionalFeeItem } from '../ui/templates/BookingDetailsTemplate';

export const mapBookingToDetailsData = (
    booking: Booking,
    bookingReference?: string
): BookingDetailsData => {
    const status = mapBookingStatus(booking.bookingStatus);
    const startsIn = calculateStartsIn(booking.startDatetime);
    const rentalPeriod = formatRentalPeriod(booking.startDatetime, booking.endDatetime);
    const duration = calculateDuration(booking.startDatetime, booking.endDatetime);

    const vehicleName = booking.vehicleModel?.modelName || 'Unknown Vehicle';
    const vehicleImageUrl = booking.vehicle?.fileUrl?.[0];

    const branchName = booking.handoverBranch?.branchName || 'Branch';
    const branchAddress = booking.handoverBranch?.address || 'Address not available';
    const branchPhone = booking.handoverBranch?.phone || '+84 123 456 789';
    const operatingHours = booking.handoverBranch?.openingTime && booking.handoverBranch?.closingTime
        ? `${booking.handoverBranch.openingTime} - ${booking.handoverBranch.closingTime}`
        : 'Open 24/7';

    const insurancePackageName = booking.insurancePackage?.packageName || 'Standard';
    const insuranceFee = formatCurrency(booking.insurancePackage?.packageFee || 0);

    const rentalFee = formatCurrency(booking.baseRentalFee);
    const serviceFee = formatCurrency(0);
    const securityDeposit = formatCurrency(booking.depositAmount);
    const totalPaid = formatCurrency(booking.totalAmount);

    const excessKmFee = booking.excessKmFee ? formatCurrency(booking.excessKmFee) : undefined;
    const cleaningFee = booking.cleaningFee ? formatCurrency(booking.cleaningFee) : undefined;
    const crossBranchFee = booking.crossBranchFee ? formatCurrency(booking.crossBranchFee) : undefined;
    const totalChargingFee = booking.totalChargingFee ? formatCurrency(booking.totalChargingFee) : undefined;
    const totalAdditionalFee = booking.totalAdditionalFee ? formatCurrency(booking.totalAdditionalFee) : undefined;
    const earlyHandoverFee = booking.earlyHandoverFee ? formatCurrency(booking.earlyHandoverFee) : undefined;
    const lateReturnFee = booking.lateReturnFee ? formatCurrency(booking.lateReturnFee) : undefined;
    const refundAmount = booking.refundAmount !== undefined ? formatCurrency(booking.refundAmount) : undefined;

    const additionalFees: AdditionalFeeItem[] | undefined = booking.additionalFees?.map(fee => ({
        id: fee.id,
        feeType: fee.feeType,
        description: fee.description,
        amount: formatCurrency(fee.amount),
    }));

    const contractStatus = booking.rentalContract?.contractStatus || 'Pending';
    const digitalSignatureCompleted = booking.rentalContract?.contractStatus === 'SIGNED';
    const signedOn = booking.rentalContract?.createdAt
        ? formatDate(booking.rentalContract.createdAt)
        : 'Not signed yet';

    const keyTerms: string[] = booking.rentalContract?.contractTerms
        ? booking.rentalContract.contractTerms.split('\n').filter(t => t.trim())
        : [
            'Refund up to 24 hours before pickup',
            'Late arrivals (>30 min) may result in cancellation',
            'Renter is liable for damages not covered by insurance',
            'Vehicle must be returned with minimum 10% battery',
        ];

    return {
        status,
        startsIn,
        bookingReference: bookingReference || booking.bookingCode || `#${booking.id.slice(0, 12)}`,
        contractStatus,
        contractVerified: digitalSignatureCompleted,
        vehicleName,
        rentalPeriod,
        duration,
        vehicleImageUrl,
        branchName,
        branchAddress,
        operatingHours,
        branchPhone,
        rentalFee,
        insuranceFee,
        insuranceBadge: insurancePackageName,
        serviceFee,
        securityDeposit,
        totalPaid,
        paymentMethod: 'eMotoRent Wallet',
        excessKmFee,
        cleaningFee,
        crossBranchFee,
        totalChargingFee,
        totalAdditionalFee,
        earlyHandoverFee,
        lateReturnFee,
        refundAmount,
        additionalFees,
        digitalSignatureCompleted,
        signedOn,
        otpVerified: digitalSignatureCompleted,
        keyTerms,
        cancellationPolicy: 'Free until 24h before pickup, 50% fee after that',
        lateArrivalPolicy: 'May result in booking cancellation with 50% fee',
        emergencyHotline: '1900 1234',
    };
};

// Keep all your helper functions here too
const mapBookingStatus = (status: string): 'confirmed' | 'pending' | 'cancelled' | 'completed' => {
    const s = status.toLowerCase();
    if (s.includes('confirm') || s === 'booked') return 'confirmed';
    if (s.includes('pending')) return 'pending';
    if (s.includes('cancel')) return 'cancelled';
    if (s.includes('complete') || s.includes('finished')) return 'completed';
    return 'pending';
};

const calculateStartsIn = (startDatetime?: Date): string => {
    if (!startDatetime) return 'Unknown';
    const now = new Date();
    const start = new Date(startDatetime);
    const diff = start.getTime() - now.getTime();
    if (diff < 0) return 'Started';
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
};

const formatRentalPeriod = (start?: Date, end?: Date): string => {
    if (!start || !end) return 'Not specified';
    const fmt = (d: Date) => {
        const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        const day = d.getDate();
        const month = months[d.getMonth()];
        const h = d.getHours() % 12 || 12;
        const m = d.getMinutes().toString().padStart(2, '0');
        const p = d.getHours() >= 12 ? 'PM' : 'AM';
        return `${month} ${day} ${h}:${m} ${p}`;
    };
    return `${fmt(new Date(start))} - ${fmt(new Date(end))}`;
};

const calculateDuration = (start?: Date, end?: Date): string => {
    if (!start || !end) return 'Unknown';
    const diff = new Date(end).getTime() - new Date(start).getTime();
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    return days > 0 ? `${days} days ${hours} hours` : `${hours} hours`;
};

const formatCurrency = (amount: number): string => `${amount.toLocaleString('vi-VN')}đ`;

const formatDate = (date: Date): string => {
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const d = new Date(date);
    return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()} - ${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`;
};