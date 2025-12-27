import { Feedback } from "../../../domain/entities/booking/Feedback";
import { FeedbackDetailResponse } from "../../models/feedback/FeedbackDetailResponse";
import { FeedbackResponse } from "../../models/feedback/FeedbackResponse";

export class FeedbackMapper {
    /**
     * Map FeedbackDetailDTO (from GET endpoints) to domain entity
     * Has renterName, no renterId
     */
    static fromDetailDTO(dto: FeedbackDetailResponse): Feedback {
        return new Feedback(
            dto.feedbackId,           // id
            dto.rating,               // rating
            dto.comment,              // comment
            '',                       // renterId (empty - not provided in detail response)
            dto.bookingId,            // bookingId ✅ FIXED!
            new Date(),               // createdAt
            null,                     // updatedAt
            null,                     // deletedAt
            false,                    // isDeleted
            undefined,                // renter
            dto.renterName,           // renterName ✅ FIXED - in correct position!
            undefined                 // booking
        );
    }

    /**
     * Map FeedbackResponseDTO (from POST /create) to domain entity
     * Has renterId, no renterName
     */
    static fromResponseDTO(dto: FeedbackResponse): Feedback {
        return new Feedback(
            dto.feedbackId,           // id
            dto.rating,               // rating
            dto.comment,              // comment
            dto.renterId,             // renterId
            dto.bookingId,            // bookingId
            new Date(),               // createdAt
            null,                     // updatedAt
            null,                     // deletedAt
            false,                    // isDeleted
            undefined,                // renter
            undefined,                // renterName (not in create response)
            undefined                 // booking
        );
    }

    static fromDetailDTOList(dtos: FeedbackDetailResponse[]): Feedback[] {
        return dtos.map(dto => this.fromDetailDTO(dto));
    }

    static fromResponseDTOList(dtos: FeedbackResponse[]): Feedback[] {
        return dtos.map(dto => this.fromResponseDTO(dto));
    }
}