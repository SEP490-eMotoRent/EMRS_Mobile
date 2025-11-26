import { CreateFeedbackInput, Feedback } from "../../entities/booking/Feedback";

export interface FeedbackRepository {
    createFeedback(input: CreateFeedbackInput): Promise<Feedback>;
    getFeedbackByBookingId(bookingId: string): Promise<Feedback[]>;
    getFeedbackByVehicleModelId(vehicleModelId: string): Promise<Feedback[]>;
    getAllFeedbacks(): Promise<Feedback[]>;
}