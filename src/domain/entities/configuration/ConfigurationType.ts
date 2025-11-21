/**
 * Configuration Type Enum
 * Matches backend ConfigurationTypeEnum
 */
export enum ConfigurationType {
    FacePlusPlus = 1,
    RentingDurationRate = 2,
    ChargingRate = 3,
    // Note: 4 (BookingDiscountRate) removed from backend
    DepositRate = 5,
    AdditionalFee = 6,
    RefundRate = 7,
    EconomyDepositPrice = 8,
    StandardDepositPrice = 9,
    PremiumDepositPrice = 10,
    // Additional fees
    LateReturnFee = 11,
    CleaningFee = 12,
    DamageFee = 13,
    CrossBranchFee = 14,
    ExcessKmFee = 15,
    EarlyHandoverFee = 16,
}

/**
 * Helper to get configuration type display name in Vietnamese
 */
export const ConfigurationTypeDisplay: Record<ConfigurationType, string> = {
    [ConfigurationType.FacePlusPlus]: "Face++ API",
    [ConfigurationType.RentingDurationRate]: "Giá thuê theo thời gian",
    [ConfigurationType.ChargingRate]: "Phí sạc điện",
    [ConfigurationType.DepositRate]: "Tỷ lệ đặt cọc",
    [ConfigurationType.AdditionalFee]: "Phí phụ trội",
    [ConfigurationType.RefundRate]: "Tỷ lệ hoàn tiền",
    [ConfigurationType.EconomyDepositPrice]: "Tiền cọc xe Tiết kiệm",
    [ConfigurationType.StandardDepositPrice]: "Tiền cọc xe Tiêu chuẩn",
    [ConfigurationType.PremiumDepositPrice]: "Tiền cọc xe Cao cấp",
    [ConfigurationType.LateReturnFee]: "Phí trả xe trễ",
    [ConfigurationType.CleaningFee]: "Phí vệ sinh xe",
    [ConfigurationType.DamageFee]: "Phí hư hỏng",
    [ConfigurationType.CrossBranchFee]: "Phí trả xe khác chi nhánh",
    [ConfigurationType.ExcessKmFee]: "Phí vượt km",
    [ConfigurationType.EarlyHandoverFee]: "Phí giao xe sớm",
};