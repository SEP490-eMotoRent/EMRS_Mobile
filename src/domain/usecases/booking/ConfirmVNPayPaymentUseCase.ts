import { VNPayCallback } from "../../../data/models/booking/vnpay/VNPayCallback";
import { BookingRepository } from "../../repositories/booking/BookingRepository";

export class ConfirmVNPayPaymentUseCase {
    constructor(private repository: BookingRepository) {}

    async execute(request: VNPayCallback): Promise<void> {
        return this.repository.confirmVNPayPayment(request);
    }
}