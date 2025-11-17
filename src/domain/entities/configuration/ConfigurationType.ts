/**
 * Configuration Type Enum
 * Matches backend ConfigurationTypeEnum
 */
export enum ConfigurationType {
    FacePlusPlus = 1,
    RentingDurationRate = 2,
    ChargingRate = 3,
    BookingDiscountRate = 4,
    DepositRate = 5,
    AdditionalFee = 6,
    RefundRate = 7,
    EconomyDepositPrice = 8,
    StandardDepositPrice = 9,
    PremiumDepositPrice = 10,
}

/**
 * Helper to get configuration type display name in Vietnamese
 */
export const ConfigurationTypeDisplay: Record<ConfigurationType, string> = {
    [ConfigurationType.FacePlusPlus]: "Face++ API",
    [ConfigurationType.RentingDurationRate]: "Giá thuê theo thời gian",
    [ConfigurationType.ChargingRate]: "Phí sạc điện",
    [ConfigurationType.BookingDiscountRate]: "Giảm giá đặt xe",
    [ConfigurationType.DepositRate]: "Tỷ lệ đặt cọc",
    [ConfigurationType.AdditionalFee]: "Phí phụ trội",
    [ConfigurationType.RefundRate]: "Tỷ lệ hoàn tiền",
    [ConfigurationType.EconomyDepositPrice]: "Tiền cọc xe Tiết kiệm",
    [ConfigurationType.StandardDepositPrice]: "Tiền cọc xe Tiêu chuẩn",
    [ConfigurationType.PremiumDepositPrice]: "Tiền cọc xe Cao cấp",
};