import { BaseEntity, CreateEntityInput, UpdateEntityInput } from "../shared/BaseEntity";
import { Renter } from "../account/Renter";
import { Booking } from "./Booking";

export class Feedback implements BaseEntity {
    public readonly id: string;
    public createdAt: Date;
    public updatedAt: Date | null;
    public deletedAt: Date | null;
    public isDeleted: boolean;

    public rating: number;
    public comment: string;
    public renterId: string;
    public bookingId: string;

    public renter?: Renter;
    public booking?: Booking;

    constructor(
        id: string,
        rating: number,
        comment: string,
        renterId: string,
        bookingId: string,
        createdAt: Date = new Date(),
        updatedAt: Date | null = null,
        deletedAt: Date | null = null,
        isDeleted: boolean = false,
        renter?: Renter,
        booking?: Booking,
    ) {
        this.id = id;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.deletedAt = deletedAt;
        this.isDeleted = isDeleted;

        this.rating = rating;
        this.comment = comment;
        this.renterId = renterId;
        this.bookingId = bookingId;

        // ✅ RELATIONS
        this.renter = renter;
        this.booking = booking;
    }

    isValidRating(): boolean {
        return this.rating >= 1 && this.rating <= 5;
    }

    delete(): void {
        this.updatedAt = new Date();
        this.deletedAt = new Date();
        this.isDeleted = true;
    }

    restore(): void {
        this.updatedAt = new Date();
        this.deletedAt = null;
        this.isDeleted = false;
    }
}

export type CreateFeedbackInput = CreateEntityInput<Feedback>;
export type UpdateFeedbackInput = UpdateEntityInput<Feedback>;