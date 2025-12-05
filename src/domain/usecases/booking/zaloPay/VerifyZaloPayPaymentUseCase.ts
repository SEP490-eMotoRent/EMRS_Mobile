import { BookingRepository } from "../../../repositories/booking/BookingRepository";

/**
 * Use case for verifying ZaloPay payment callback
 */
export class VerifyZaloPayPaymentUseCase {
    constructor(private bookingRepository: BookingRepository) {}

    async execute(
        appId: number,
        appTransId: string,
        pmcId: number,
        bankCode: string,
        amount: number,
        discountAmount: number,
        status: number,
        checksum: string
    ): Promise<boolean> {
        console.log('🎯 [UseCase] Verifying ZaloPay payment');
        console.log('📋 Transaction ID:', appTransId);
        console.log('💰 Amount:', amount);
        console.log('📊 Status:', status);

        // Validate required fields
        if (!appTransId) {
        throw new Error('Transaction ID is required');
        }

        if (status === undefined || status === null) {
        throw new Error('Payment status is required');
        }

        if (!checksum) {
        throw new Error('Checksum is required');
        }

        if (appId <= 0) {
        throw new Error('Invalid app ID');
        }

        console.log('✅ [UseCase] Validation passed');

        // Call repository - returns boolean directly
        const isVerified = await this.bookingRepository.verifyZaloPayPayment(
        appId,
        appTransId,
        pmcId,
        bankCode,
        amount,
        discountAmount,
        status,
        checksum
        );

        if (isVerified) {
        console.log('✅ [UseCase] Payment verified successfully');
        } else {
        console.log('❌ [UseCase] Payment verification failed');
        }

        return isVerified;
    }
}