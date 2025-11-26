import { Feedback } from "../../entities/booking/Feedback";
import { FeedbackRepository } from "../../repositories/booking/FeedbackRepository";

export class GetFeedbackByBookingIdUseCase {
    private repository: FeedbackRepository;

    constructor(repository: FeedbackRepository) {
        this.repository = repository;
    }

    async execute(bookingId: string): Promise<Feedback[]> {
        return this.repository.getFeedbackByBookingId(bookingId);
    }
}