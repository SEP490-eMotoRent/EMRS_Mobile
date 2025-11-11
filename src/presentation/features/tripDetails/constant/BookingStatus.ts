export enum BookingStatus {
    BOOKED = "Booked",
    RENTING = "Renting",
    CANCELLED = "Cancelled",
    COMPLETED = "Completed",
}

export const BookingStatusMap = {
    [BookingStatus.BOOKED]: "Chờ duyệt",
    [BookingStatus.RENTING]: "Đang thuê",
    [BookingStatus.CANCELLED]: "Đã hủy",
    [BookingStatus.COMPLETED]: "Đã hoàn thành",
}

export const BookingStatusColorMap = {
    [BookingStatus.BOOKED]: "#FF9800",
    [BookingStatus.RENTING]: "#4CAF50",
    [BookingStatus.CANCELLED]: "#F44336",
    [BookingStatus.COMPLETED]: "#2ED573",
}
